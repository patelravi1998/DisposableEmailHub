import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Joi from "joi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  currentEmail: string;
}

export const ReferFriendModal = ({ currentEmail }: Props) => {
  const [open, setOpen] = useState(false);
  const [referTo, setReferTo] = useState('');
  const [referBy, setReferBy] = useState(currentEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ for loading state


  const schema = Joi.object({
    referal_to_email: Joi.string().email({ tlds: { allow: false } }).required(),
    referal_by_email: Joi.string().email({ tlds: { allow: false } }).required(),
  });

  const handleSubmit = async () => {
    const { error, value } = schema.validate({
      referal_to_email: referTo,
      referal_by_email: referBy,
    });

    if (error) {
      toast.error(error.details[0].message);
      return;
    }
    setIsSubmitting(true); // ✅ disable button


    try {
      const response = await fetch(`${API_BASE_URL}/users/referal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.log(`>>>>errData${JSON.stringify(errData)}`)
        return toast.error(errData.error.message || 'Referral failed');

      }

      toast.success("Referral submitted successfully!");
      setReferTo('')
      setReferBy('')
      setOpen(false);
    } catch (err: any) {
        setReferTo('')
        setReferBy('')
      toast.error(err.message);
    }finally {
        setIsSubmitting(false); // ✅ enable button
    }
  };

  return (
    <div className="mt-4">
      <div className="bg-blue-100 text-blue-800 border border-blue-300 rounded-md px-4 py-3 text-sm mb-3">
        Refer your friend to extend your email by <strong>1 week</strong>!<br />
        Ask your friend to sign up using the link they receive. <br />
        <span className="text-red-600 font-semibold">Note:</span> Tell them to check the <strong>Spam folder</strong> if they don’t see the email.
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
            Refer your friend
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refer your friend</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Friend's Email"
              value={referTo}
              onChange={(e) => setReferTo(e.target.value)}
            />
            <Input
              placeholder="Your Email (To be extended)"
              value={referBy}
              onChange={(e) => setReferBy(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting} // ✅ disable when loading
            >
              {isSubmitting ? 'Submitting...' : 'Submit Referral'}
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
