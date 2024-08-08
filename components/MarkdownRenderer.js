import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from 'react-icons/fa6';
import remarkGfm from 'remark-gfm'; // Import the GFM plugin
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // Use the GFM plugin to support tables and more
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          return !inline && match ? (
            <div style={{ position: 'relative', marginBottom: '1em' }}>
              <CopyToClipboard text={String(children).replace(/\n$/, '')}>
                <button
                  style={{
                    position: 'absolute',
                    top: '0.5em',
                    right: '0.5em',
                    borderRadius: '0.3em',
                    cursor: 'pointer',
                    padding: '0.2em',
                    background: 'none',
                    border: 'none',
                    color: '#5fe1d5',
                  }}
                >
                  <FaRegCopy size={20} />
                </button>
              </CopyToClipboard>
              <SyntaxHighlighter style={okaidia} language={language} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className={className}
              {...props}
              style={{
                color: '#682bd7', // Apply the color to inline code
                backgroundColor: 'rgba(222, 222, 222, 0.3)', // Optional: light background for better visibility
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontWeight: 'bold',
                fontSize: '105%',
              }}
            >
              {children}
            </code>
          );
        },
        table({ node, ...props }) {
          return (
            <div style={{ overflowX: 'auto', marginBottom: '1em', border: '3px solid #ddd', borderRadius: '4px' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderRadius: '4px',
                }}
                {...props}
              />
            </div>
          );
        },
        th({ node, ...props }) {
          return (
            <th
              style={{
                padding: '0.5em',
                backgroundColor: '#f2f2f2',
                borderBottom: '2px solid #ccc',
                textAlign: 'left',
                fontWeight: 'bold',
                color: '#333',
              }}
              {...props}
            />
          );
        },
        td({ node, ...props }) {
          return (
            <td
              style={{
                padding: '0.5em',
                borderBottom: '1px solid #ccc',
                color: '#333',
              }}
              {...props}
            />
          );
        },
        p({ node, ...props }) {
          return (
            <p
              style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#333',
              }}
              {...props}
            />
          );
        },
        h1({ node, ...props }) {
          return (
            <h1
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                marginBottom: '0.5em',
                color: '#000',
              }}
              {...props}
            />
          );
        },
        h2({ node, ...props }) {
          return (
            <h2
              style={{
                fontSize: '32px',
                marginBottom: '0.5em',
                color: '#000',
              }}
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
