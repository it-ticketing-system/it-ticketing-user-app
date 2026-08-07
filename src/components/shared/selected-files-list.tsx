import { Button } from '@heroui/react';
import { FileText, Trash2 } from 'lucide-react';
import { ICON_SIZE_CLASS } from '@/constants';
import { formatFileSize } from '@/utils';

interface SelectedFilesListProps {
  files: File[];
  removeAriaLabel: (fileName: string) => string;
  onRemove: (index: number) => void;
  isDisabled?: boolean;
}

const SelectedFilesList = ({
  files,
  removeAriaLabel,
  isDisabled = false,
  onRemove,
}: SelectedFilesListProps) => {
  if (!files.length) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-2 overflow-hidden">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${file.lastModified}`}
          className="border-border bg-surface flex min-h-14 min-w-0 items-center gap-3 overflow-hidden rounded-lg border p-3"
        >
          <div className="bg-accent-soft text-accent flex size-9 shrink-0 items-center justify-center rounded-md">
            <FileText aria-hidden="true" className={ICON_SIZE_CLASS.md} />
          </div>

          <div className="min-w-0 flex-1">
            <p
              dir="ltr"
              className="text-body-sm text-foreground truncate text-end font-medium"
            >
              {file.name}
            </p>

            <p className="text-caption text-muted">
              {formatFileSize(file.size)}
            </p>
          </div>

          <Button
            type="button"
            isIconOnly
            size="sm"
            variant="danger-soft"
            isDisabled={isDisabled}
            aria-label={removeAriaLabel(file.name)}
            onPress={() => onRemove(index)}
            className="shrink-0"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SelectedFilesList;
