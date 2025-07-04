import React, { useRef } from 'react';
import { Box, Stack, IconButton, Divider, Paper, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link,
  Image,
  FormatClear,
} from '@mui/icons-material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  minHeight = 300,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormat = (tag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      const element = document.createElement(tag);
      element.textContent = selectedText;
      range.deleteContents();
      range.insertNode(element);
      
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleAddLink = () => {
    const url = prompt("Nhập URL:");
    if (url) {
      handleCommand('createLink', url);
    }
  };

  const handleAddImage = () => {
    const url = prompt("Nhập URL hình ảnh:");
    if (url) {
      handleCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: <FormatBold />, command: 'bold', tooltip: 'In đậm' },
    { icon: <FormatItalic />, command: 'italic', tooltip: 'In nghiêng' },
    { icon: <FormatUnderlined />, command: 'underline', tooltip: 'Gạch chân' },
    { divider: true },
    { icon: <FormatListBulleted />, command: 'insertUnorderedList', tooltip: 'Danh sách không thứ tự' },
    { icon: <FormatListNumbered />, command: 'insertOrderedList', tooltip: 'Danh sách có thứ tự' },
    { divider: true },
    { icon: <FormatQuote />, command: 'formatBlock', value: 'blockquote', tooltip: 'Trích dẫn' },
    { icon: <Code />, command: 'formatBlock', value: 'pre', tooltip: 'Code block' },
    { divider: true },
    { icon: <Link />, command: 'link', tooltip: 'Chèn liên kết', handler: handleAddLink },
    { icon: <Image />, command: 'image', tooltip: 'Chèn hình ảnh', handler: handleAddImage },
    { divider: true },
    { icon: <FormatClear />, command: 'removeFormat', tooltip: 'Xóa định dạng' },
  ];

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {toolbarButtons.map((button, index) => {
            if (button.divider) {
              return <Divider key={index} orientation="vertical" flexItem sx={{ mx: 0.5 }} />;
            }
            
            return (
              <Tooltip key={index} title={button.tooltip}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (button.handler) {
                      button.handler();
                    } else {
                      handleCommand(button.command, button.value);
                    }
                  }}
                >
                  {button.icon}
                </IconButton>
              </Tooltip>
            );
          })}
        </Stack>
      </Box>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        sx={{
          p: 2,
          minHeight,
          maxHeight: 500,
          overflowY: 'auto',
          outline: 'none',
          '&:focus': {
            outline: 'none',
          },
          '&:empty:before': {
            content: `"${placeholder}"`,
            color: 'text.secondary',
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
            pl: 2,
            ml: 0,
            my: 1,
          },
          '& pre': {
            backgroundColor: 'grey.100',
            p: 1,
            borderRadius: 1,
            overflowX: 'auto',
          },
        }}
        onInput={(e) => {
          const target = e.target as HTMLDivElement;
          onChange(target.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </Paper>
  );
};

export default RichTextEditor;