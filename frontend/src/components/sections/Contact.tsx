import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { contactFormAtom, isSubmittingAtom, formStatusAtom } from '../../store/atoms';
import { useInView } from '../../hooks/useInView';

const saveSlots = [
  {
    slot: 1,
    label: 'EMAIL',
    value: 'alexandervenus22@gmail.com',
    href: 'mailto:alexandervenus22@gmail.com',
    icon: '✉',
  },
  {
    slot: 2,
    label: 'LINKEDIN',
    value: 'Alexander Venus',
    href: 'https://www.linkedin.com/in/alexander-venus-338482150/',
    icon: '🛡',
  },
  {
    slot: 3,
    label: 'TWITTER/X',
    value: '@extrangxander22',
    href: 'https://x.com/extrangxander22',
    icon: '⚔',
  },
];

export function Contact() {
  const [formData, setFormData] = useAtom(contactFormAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);
  const [formStatus, setFormStatus] = useAtom(formStatusAtom);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setFormStatus('idle');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }).toString(),
      });
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-background" style={{ '--section-accent': 'var(--rpg-hp)' } as React.CSSProperties}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-display text-[8px] text-rpg-hp/50 tracking-widest">05</span>
          <div className="w-8 h-px bg-rpg-hp/20" />
          <span className="font-display text-[8px] text-foreground/40 tracking-widest">SAVE POINT</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Save Crystal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          {/* Crystal icon via CSS */}
          <div className="w-16 h-16 bg-rpg-mp/20 border-2 border-rpg-mp/40 save-crystal flex items-center justify-center mb-4 rotate-45">
            <span className="text-2xl -rotate-45">💎</span>
          </div>
          <p className="font-display text-[8px] text-rpg-mp/60 tracking-[0.3em]">
            CHECKPOINT REACHED
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Save Slots */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-display text-[8px] text-foreground/40 tracking-widest mb-4">
              SAVE FILES
            </h3>

            {saveSlots.map((slot, i) => (
              <motion.a
                key={slot.slot}
                href={slot.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="block pixel-panel p-4 hover:glow transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rpg-hp/10 border border-rpg-hp/20 flex items-center justify-center">
                    <span className="text-lg">{slot.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-[7px] text-foreground/30 tracking-wider">
                        SLOT {slot.slot}
                      </span>
                      <span className="font-display text-[7px] text-rpg-hp tracking-wider">
                        {slot.label}
                      </span>
                    </div>
                    <span className="text-sm text-foreground/60 group-hover:text-rpg-hp transition-colors">
                      {slot.value}
                    </span>
                  </div>
                  <span className="font-display text-[7px] text-rpg-heal tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    LOAD
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Right: Contact Form as Write Message */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} name="contact" data-netlify="true" className="pixel-panel p-6">
              <input type="hidden" name="form-name" value="contact" />
              <h3 className="font-display text-[8px] text-foreground/40 tracking-widest mb-6 pb-2 border-b border-rpg-hp/15">
                WRITE MESSAGE
              </h3>

              <div className="space-y-4">
                <Input
                  label="NAME"
                  placeholder="Hero name..."
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                />

                <Input
                  label="EMAIL"
                  type="email"
                  placeholder="hero@guild.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                />

                <Textarea
                  label="MESSAGE"
                  placeholder="Describe your quest..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  error={errors.message}
                  className="min-h-[120px]"
                />

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-rpg-hp text-white font-display text-[8px] tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ boxShadow: '0 0 8px hsl(var(--rpg-hp) / 0.3)' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      SAVE GAME
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                {formStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rpg-dialog"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-rpg-heal" />
                      <span className="text-rpg-heal text-[13px]">GAME SAVED SUCCESSFULLY!</span>
                    </div>
                  </motion.div>
                )}

                {formStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rpg-dialog"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rpg-hp" />
                      <span className="text-rpg-hp text-[13px]">SAVE FAILED! TRY AGAIN.</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
