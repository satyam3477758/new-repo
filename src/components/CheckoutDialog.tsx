import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard } from 'lucide-react';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: DeliveryDetails) => void;
  cartTotal: number;
  isProcessing: boolean;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cartTotal,
  isProcessing 
}) => {
  const [details, setDetails] = useState<DeliveryDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<DeliveryDetails> = {};
    
    if (!details.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!details.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(details.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number';
    if (!details.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(details.email)) newErrors.email = 'Invalid email';
    if (!details.address.trim()) newErrors.address = 'Address is required';
    if (!details.city.trim()) newErrors.city = 'City is required';
    if (!details.state.trim()) newErrors.state = 'State is required';
    if (!details.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(details.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(details);
    }
  };

  const handleChange = (field: keyof DeliveryDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Delivery Details</DialogTitle>
          <DialogDescription>
            Please provide your delivery information to complete the order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={details.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={details.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="9876543210"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={details.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              value={details.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="House/Flat No., Street, Area"
              rows={3}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={details.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Mumbai"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={details.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Maharashtra"
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={details.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="400001"
                className={errors.pincode ? 'border-red-500' : ''}
              />
              {errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={details.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any special instructions for delivery"
              rows={2}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Confirm Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
