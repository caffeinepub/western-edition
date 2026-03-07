import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useSubmitShowroomLead } from "../hooks/useQueries";

interface ShowroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

export function ShowroomModal({
  open,
  onOpenChange,
  productName,
}: ShowroomModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    message: productName ? `I'm interested in the ${productName}.` : "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useSubmitShowroomLead();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(form);
      setSubmitted(true);
    } catch {
      // handled by mutation.isError
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      mutation.reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="showroom.dialog"
        className="max-w-lg w-full p-8 border border-stone bg-background"
        style={{ borderRadius: 0 }}
      >
        {/* Custom close button */}
        <button
          type="button"
          onClick={handleClose}
          data-ocid="showroom.close_button"
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <DialogHeader className="mb-6">
          <DialogTitle className="font-serif text-2xl text-foreground leading-snug">
            Book a Showroom Visit
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2 font-sans">
            Our design consultants will guide you through the collection
            personally.
          </p>
        </DialogHeader>

        {/* Success state */}
        {submitted ? (
          <div
            data-ocid="showroom.success_state"
            className="py-10 flex flex-col items-center gap-4 text-center"
          >
            <CheckCircle2
              size={40}
              strokeWidth={1}
              className="text-foreground"
            />
            <p className="font-serif text-xl">
              Thank you, {form.name || "you"}.
            </p>
            <p className="text-sm text-muted-foreground font-sans max-w-xs">
              Our team will reach out within 24 hours to confirm your visit.
            </p>
            <Button
              variant="outline"
              onClick={handleClose}
              className="mt-4 tracking-widest text-xs uppercase border-foreground text-foreground hover:bg-foreground hover:text-background"
              style={{ borderRadius: 0 }}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error state */}
            {mutation.isError && (
              <div
                data-ocid="showroom.error_state"
                className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3 font-sans"
              >
                Something went wrong. Please try again.
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="showroom-name"
                className="text-xs tracking-widest uppercase font-sans text-muted-foreground"
              >
                Full Name
              </Label>
              <Input
                id="showroom-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                data-ocid="showroom.name.input"
                placeholder="Arjun Mehta"
                className="border-stone border rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="showroom-email"
                className="text-xs tracking-widest uppercase font-sans text-muted-foreground"
              >
                Email Address
              </Label>
              <Input
                id="showroom-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                data-ocid="showroom.email.input"
                placeholder="arjun@example.com"
                className="border-stone border rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label
                htmlFor="showroom-phone"
                className="text-xs tracking-widest uppercase font-sans text-muted-foreground"
              >
                Phone Number
              </Label>
              <Input
                id="showroom-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                data-ocid="showroom.phone.input"
                placeholder="+91 98765 43210"
                className="border-stone border rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>

            {/* Pincode */}
            <div className="space-y-1.5">
              <Label
                htmlFor="showroom-pincode"
                className="text-xs tracking-widest uppercase font-sans text-muted-foreground"
              >
                Delivery Pincode
              </Label>
              <Input
                id="showroom-pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                data-ocid="showroom.pincode.input"
                placeholder="400013"
                maxLength={6}
                className="border-stone border rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label
                htmlFor="showroom-message"
                className="text-xs tracking-widest uppercase font-sans text-muted-foreground"
              >
                Message
              </Label>
              <Textarea
                id="showroom-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                data-ocid="showroom.message.textarea"
                placeholder="Tell us about your project or any specific requirements..."
                rows={3}
                className="border-stone border rounded-none text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground resize-none"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              data-ocid="showroom.submit.submit_button"
              disabled={mutation.isPending}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/85 tracking-[0.15em] text-xs uppercase font-sans transition-colors duration-200"
              style={{ borderRadius: 0 }}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
