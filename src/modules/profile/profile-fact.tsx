interface ProfileFactProps {
  label: string;
  value: string;
}

const ProfileFact = ({ label, value }: ProfileFactProps) => (
  <div className="bg-surface border-border min-w-0 rounded-lg border px-3 py-2">
    <p className="text-caption text-muted">{label}</p>
    <p className="text-body-sm text-foreground mt-1 truncate font-medium">
      {value}
    </p>
  </div>
);

export default ProfileFact;
