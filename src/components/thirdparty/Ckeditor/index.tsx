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
          onReady={(editor) => {
            const editableElement = editor.ui.getEditableElement();

            if (editableElement) {
              editableElement.style.minHeight = `${minHeight}px`;
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default Ckeditor;
