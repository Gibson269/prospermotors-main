import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
}

const WhatsAppButton = ({ message = "Hello Prosperous Autos, I'm interested in your luxury vehicles." }: WhatsAppButtonProps) => {
  const phoneNumber = "2348133629899";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8 text-white fill-white" />
    </a>
  );
};

export default WhatsAppButton;
