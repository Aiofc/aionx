'use client';
import { useEffect, useState } from 'react';
import { Button } from '@aionx/aionx-ui';
import { Modal } from '../modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="确定?"
      description="此操作不可逆。请谨慎操作"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          继续
        </Button>
      </div>
    </Modal>
  );
};
