"use client";

import { useEffect, useState } from "react";

interface PromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (folderName: string) => void;
  currentPrompt: string | null;
}

export default function PromptDialog({ isOpen, onClose, onSelect, currentPrompt }: PromptDialogProps) {
  const [promptFolders, setPromptFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/prompts")
        .then((res) => res.json())
        .then((data: string[]) => {
          setPromptFolders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load prompts:", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (folderName: string) => {
    onSelect(folderName);
    onClose();
  };

  const formatFolderName = (name: string) => {
    return name
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Select Prompt</h3>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dialog-body">
          {loading ? (
            <div className="dialog-loading">Loading prompts...</div>
          ) : (
            <div className="prompt-list">
              {promptFolders.map((folder) => (
                <div
                  key={folder}
                  className={`prompt-item ${currentPrompt === folder ? "active" : ""}`}
                  onClick={() => handleSelect(folder)}
                >
                  <div className="prompt-item-header">
                    <strong>{formatFolderName(folder)}</strong>
                    {currentPrompt === folder && (
                      <span className="prompt-item-badge">Active</span>
                    )}
                  </div>
                  <p className="prompt-item-description">
                    Load experiment data from {folder}/ folder
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
