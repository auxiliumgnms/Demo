import { Switch } from "@/components/ui/switch";

interface VoiceFeedbackToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function VoiceFeedbackToggle({ enabled, onChange }: VoiceFeedbackToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <Switch 
        checked={enabled} 
        onCheckedChange={onChange}
        className="bg-neutral-200 data-[state=checked]:bg-primary"
      />
    </label>
  );
}
