"use client";

import React from "react";
import { Box, Paper } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CkeditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

class MyUploadAdapter {
  private loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve({ default: reader.result as string });
          };

          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        }),
    );
  }

  abort() {}
}

const Ckeditor: React.FC<CkeditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  minHeight = 300,
}) => {
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ p: 1 }}>
        <CKEditor
          editor={ClassicEditor}
          data={value || ""}
          config={{
            placeholder,
            toolbar: {
              items: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "uploadImage",
                "blockQuote",
                "undo",
                "redo",
              ],
              shouldNotGroupWhenFull: true,
            },
          }}
          onChange={(_, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
          onReady={(editor: any) => {
            editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
            new MyUploadAdapter(loader);

            editor.editing.view.change((writer: any) => {
              const viewEditable = editor.editing.view.document.getRoot();
              writer.setStyle("min-height", `${minHeight}px`, viewEditable);
            });
          }}
        />
      </Box>
    </Paper>
  );
};

export default Ckeditor;
