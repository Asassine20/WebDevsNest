// components/MarkdownRenderer.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { defaultStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // You can change this to any other theme
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from 'react-icons/fa6';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          return !inline && match ? (
            <div style={{ position: 'relative', marginBottom: '1em', border: '1px solid #4b0082', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5em', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4b0082' }}>{language}</span>
                <CopyToClipboard text={String(children).replace(/\n$/, '')}>
                  <button style={{ borderRadius: '4px', cursor: 'pointer', padding: '0.2em' }}>
                    <FaRegCopy size={20} color="#4b0082" />
                  </button>
                </CopyToClipboard>
              </div>
              <SyntaxHighlighter style={defaultStyle} language={language} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        img({ node, ...props }) {
          return <iframe {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
