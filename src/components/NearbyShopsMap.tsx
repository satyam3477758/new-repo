import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation, Store, Loader2, TrendingUp, Award, DollarSign, Heart, Leaf, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { callAI } from '@/lib/openrouter';

const Map = lazy(() => import('./Map'));

interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  description: string;
  qualityScore?: number;
  priceCompetitiveness?: number;
  popularityScore?: number;
  environmentalScore?: number;
  varietyScore?: number;
}


// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NearbyShopsMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [shopsCache, setShopsCache] = useState<Record<string, { shops: Shop[], timestamp: number }>>({});
  const [directionsDialog, setDirectionsDialog] = useState<{ open: boolean; url: string; shopName: string }>({
    open: false,
    url: '',
    shopName: ''
  });
  const { toast } = useToast();
  const { user, session } = useAuth();

  const getUserLocation = () => {
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to find nearby shops.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);

    // Check localStorage for cached location (valid for 5 minutes)
    const cachedLocation = localStorage.getItem('userLocation');
    const cachedTimestamp = localStorage.getItem('userLocationTimestamp');

    if (cachedLocation && cachedTimestamp) {
      const age = Date.now() - parseInt(cachedTimestamp);
      if (age < 5 * 60 * 1000) { // 5 minutes
        const coords = JSON.parse(cachedLocation) as [number, number];
        setUserLocation(coords);
        setIsLoadingLocation(false);
        toast({
          title: "Location loaded",
          description: "Using cached location. Finding shops...",
        });
        discoverShops(coords);
        return;
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];

          // Cache location
          localStorage.setItem('userLocation', JSON.stringify(coords));
          localStorage.setItem('userLocationTimestamp', Date.now().toString());

          setUserLocation(coords);
          setIsLoadingLocation(false);
          toast({
            title: "Location found",
            description: "Finding nearby shops...",
          });
          await discoverShops(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          toast({
            title: "Location error",
            description: "Could not get your location. Please enable location services.",
            variant: "destructive",
          });
        },
        { timeout: 10000, enableHighAccuracy: false } // 10 second timeout, don't wait for high accuracy
      );
    } else {
      setIsLoadingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
  };

  const openDirections = (shopLat: number, shopLng: number, shopName: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLocation[0]},${userLocation[1]}&destination=${shopLat},${shopLng}&mode=driving`;
      setDirectionsDialog({ open: true, url, shopName });
    } else {
      toast({
        title: "Location required",
        description: "Please enable location to get directions.",
        variant: "destructive",
      });
    }
  };

  const discoverShops = async (coords: [number, number]) => {
    // Check cache first (valid for 10 minutes)
    const cacheKey = `${coords[0].toFixed(2)},${coords[1].toFixed(2)}`; // Round to 2 decimals for cache
    const cached = shopsCache[cacheKey];

    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) { // 10 minutes
      console.log('Using cached shops data');
      setShops(cached.shops);
      toast({
        title: "Shops loaded",
        description: `Found ${cached.shops.length} nearby farm shops (cached)`,
      });
      return;
    }

    setIsLoadingShops(true);
    try {
      console.log('Calling discover-shops function with coords:', coords);

      const promptText = `Generate a realistic list of 8-10 farm shops and organic markets near coordinates ${coords[0]}, ${coords[1]}.
For each shop, provide detailed analysis including:
- id: unique identifier
- name: A realistic farm shop name
- address: A plausible street address in the area
- lat: Latitude (vary by 0.01-0.05 from ${coords[0]})
- lng: Longitude (vary by 0.01-0.05 from ${coords[1]})
- description: Brief description of what they sell (organic produce, dairy, meat, etc.)
- qualityScore: Product quality rating (0-100)
- priceCompetitiveness: How competitive the prices are (0-100, higher means better value)
- popularityScore: Shop popularity rating (0-100)
- environmentalScore: Environmental sustainability rating (0-100)
- varietyScore: Product variety rating (0-100)

Return ONLY a JSON array with this exact structure, no other text:
[{"id": "1", "name": "...", "address": "...", "lat": number, "lng": number, "description": "...", "qualityScore": number, "priceCompetitiveness": number, "popularityScore": number, "environmentalScore": number, "varietyScore": number}]`;

      const aiResponse = await callAI({
        model: 'google/gemma-3-4b-it:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates realistic farm shop data with detailed analysis scores in JSON format. Always return valid JSON arrays only.'
          },
          { role: 'user', content: promptText }
        ],
      });

      console.log('AI Response:', aiResponse);

      let parsedShops: any[] = [];
      try {
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedShops = JSON.parse(jsonMatch[0]);
        } else {
          parsedShops = JSON.parse(aiResponse);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Fallback shops
        parsedShops = [
          {
            id: "1", name: "Green Valley Farm Shop", address: "123 Farm Road",
            lat: coords[0] + 0.02, lng: coords[1] + 0.02,
            description: "Fresh organic vegetables and dairy products",
            qualityScore: 85, priceCompetitiveness: 75, popularityScore: 80, environmentalScore: 90, varietyScore: 70
          },
          {
            id: "2", name: "Sunrise Organic Market", address: "456 Market Street",
            lat: coords[0] - 0.03, lng: coords[1] + 0.01,
            description: "Locally sourced organic produce and artisan goods",
            qualityScore: 78, priceCompetitiveness: 82, popularityScore: 75, environmentalScore: 85, varietyScore: 80
          }
        ];
      }

      if (parsedShops && Array.isArray(parsedShops)) {
        const shopsWithDistance = parsedShops
          .filter((shop: any) => shop && typeof shop === 'object' && shop.lat && shop.lng)
          .map((shop: any) => ({
            id: shop.id || Math.random().toString(),
            name: shop.name || 'Unknown Shop',
            address: shop.address || 'No address',
            lat: Number(shop.lat),
            lng: Number(shop.lng),
            description: shop.description || 'No description',
            qualityScore: shop.qualityScore || 0,
            priceCompetitiveness: shop.priceCompetitiveness || 0,
            popularityScore: shop.popularityScore || 0,
            environmentalScore: shop.environmentalScore || 0,
            varietyScore: shop.varietyScore || 0,
            distance: calculateDistance(coords[0], coords[1], Number(shop.lat), Number(shop.lng))
          }))
          .sort((a: Shop, b: Shop) => a.distance - b.distance);

        console.log('Processed shops:', shopsWithDistance);
        setShops(shopsWithDistance);

        // Cache the results
        setShopsCache(prev => ({
          ...prev,
          [cacheKey]: {
            shops: shopsWithDistance,
            timestamp: Date.now()
          }
        }));

        toast({
          title: "Shops discovered",
          description: `Found ${shopsWithDistance.length} nearby farm shops`,
        });
      } else {
        console.warn('No shops in parsed data:', parsedShops);
        toast({
          title: "No shops found",
          description: "Could not find nearby shops. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error discovering shops:', error);
      toast({
        title: "Error",
        description: "Could not discover nearby shops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingShops(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6 text-center">
          <Button
            onClick={getUserLocation}
            disabled={isLoadingLocation || isLoadingShops}
            size="lg"
            className="gap-2"
          >
            {isLoadingLocation || isLoadingShops ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding Location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Find Nearby Shops
              </>
            )}
          </Button>
        </div>

        {userLocation && (
          <div className="rounded-lg overflow-hidden border border-border" style={{ height: '500px' }}>
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }>
              <Map key={`${userLocation[0]},${userLocation[1]}`} center={userLocation} shops={shops} />
            </Suspense>
          </div>
        )}

        {!userLocation && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click "Find Nearby Shops" to see farm shops near you</p>
          </div>
        )}
      </Card>

      {shops.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Shop Analysis</h2>
            </div>
            <Tabs defaultValue="cost" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="cost" className="gap-1">
                  <DollarSign className="w-4 h-4" />
                  Cost
                </TabsTrigger>
                <TabsTrigger value="quality" className="gap-1">
                  <Award className="w-4 h-4" />
                  Quality
                </TabsTrigger>
                <TabsTrigger value="environment" className="gap-1">
                  <Leaf className="w-4 h-4" />
                  Environment
                </TabsTrigger>
                <TabsTrigger value="popularity" className="gap-1">
                  <Heart className="w-4 h-4" />
                  Popularity
                </TabsTrigger>
                <TabsTrigger value="comparison" className="gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  Compare
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cost" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Travel cost (₹8/km) and price competitiveness comparison
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      travelCost: Number((shop.distance * 8).toFixed(2)),
                      priceScore: shop.priceCompetitiveness || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                            <p className="font-semibold mb-1">{data.fullName}</p>
                            <p className="text-sm">Travel Cost: ₹{data.travelCost}</p>
                            <p className="text-sm">Price Score: {data.priceScore}/100</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Bar dataKey="travelCost" fill="hsl(var(--primary))" name="Travel Cost (₹)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="priceScore" fill="hsl(var(--primary) / 0.6)" name="Price Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="quality" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Product quality and variety ratings
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      quality: shop.qualityScore || 0,
                      variety: shop.varietyScore || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quality" fill="hsl(var(--primary))" name="Quality Score" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="variety" fill="hsl(var(--primary) / 0.6)" name="Variety Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="environment" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Environmental sustainability ratings
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      score: shop.environmentalScore || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" name="Eco Score" radius={[8, 8, 0, 0]}>
                      {shops.map((shop, index) => {
                        const score = shop.environmentalScore || 0;
                        const color = score >= 80 ? 'hsl(142, 76%, 36%)' : score >= 60 ? 'hsl(47, 96%, 53%)' : 'hsl(0, 84%, 60%)';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="popularity" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Shop popularity and customer ratings
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={shops.map(shop => ({
                      name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
                      score: shop.popularityScore || 0,
                      fullName: shop.name
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Popularity Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="comparison" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Multi-dimensional comparison of top 5 shops
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={[
                    {
                      metric: 'Quality',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.qualityScore || 0
                      }), {})
                    },
                    {
                      metric: 'Price',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.priceCompetitiveness || 0
                      }), {})
                    },
                    {
                      metric: 'Popularity',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.popularityScore || 0
                      }), {})
                    },
                    {
                      metric: 'Eco Score',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.environmentalScore || 0
                      }), {})
                    },
                    {
                      metric: 'Variety',
                      ...shops.slice(0, 5).reduce((acc, shop, i) => ({
                        ...acc,
                        [`shop${i + 1}`]: shop.varietyScore || 0
                      }), {})
                    }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    {shops.slice(0, 5).map((shop, i) => (
                      <Radar
                        key={shop.id}
                        name={shop.name.length > 20 ? shop.name.substring(0, 20) + '...' : shop.name}
                        dataKey={`shop${i + 1}`}
                        stroke={`hsl(var(--primary) / ${1 - (i * 0.15)})`}
                        fill={`hsl(var(--primary) / ${0.3 - (i * 0.05)})`}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Nearby Shops ({shops.length})</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {shops.map((shop) => (
                <Card key={shop.id} className="p-4 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg mb-2">{shop.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{shop.address}</p>
                  <p className="text-sm mb-3">{shop.description}</p>
                  {(shop.qualityScore || shop.environmentalScore) && (
                    <div className="flex gap-2 mb-3">
                      {shop.qualityScore && (
                        <div className="flex items-center gap-1 text-xs">
                          <Award className="w-3 h-3 text-primary" />
                          <span>Quality: {shop.qualityScore}/100</span>
                        </div>
                      )}
                      {shop.environmentalScore && (
                        <div className="flex items-center gap-1 text-xs">
                          <Leaf className="w-3 h-3 text-green-600" />
                          <span>Eco: {shop.environmentalScore}/100</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.distance.toFixed(1)} km</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Est. travel cost: ₹{(shop.distance * 8).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDirections(shop.lat, shop.lng, shop.name)}
                    >
                      Get Directions
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}

      <Dialog open={directionsDialog.open} onOpenChange={(open) => setDirectionsDialog({ ...directionsDialog, open })}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Directions to {directionsDialog.shopName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full">
            <iframe
              src={directionsDialog.url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NearbyShopsMap;
