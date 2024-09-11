import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from 'react-icons/fa6';
import remarkGfm from 'remark-gfm'; // Import the GFM plugin
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { useEffect } from 'react';

const GoogleAd = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle && document.querySelectorAll('.adsbygoogle').length) {
      // Ensure this specific ad slot has not already been initialized
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Ad error:', e);
      }
    }
  }, []);

  return (
    <div style={{ margin: '1em 0', textAlign: 'center' }}>
      {/* Google AdSense ad unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot="8227785553" // Replace with your AdSense slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // Use the GFM plugin to support tables and more
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          return !inline && match ? (
            <div style={{ marginBottom: '1em', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#272822', borderTopLeftRadius: '0.3em', borderTopRightRadius: '0.3em', padding: '0.5em 1em' }}>
                <span style={{ color: '#5fe1d5', fontSize: '0.9em', fontWeight: 'bold' }}>{language}</span>
                <CopyToClipboard text={String(children).replace(/\n$/, '')}>
                  <button style={{ borderRadius: '0.3em', cursor: 'pointer', padding: '0.2em', background: 'none', border: 'none', color: '#5fe1d5', display: 'flex', alignItems: 'center' }}>
                    <FaRegCopy size={20} />
                    <span style={{ marginLeft: '0.3em', fontSize: '0.9em' }}>Copy code</span>
                  </button>
                </CopyToClipboard>
              </div>
              <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <SyntaxHighlighter
                  style={okaidia}
                  language={language}
                  PreTag="div"
                  {...props}
                  customStyle={{
                    margin: '-2px',
                    padding: '1em',
                    borderBottomLeftRadius: '0.5em',
                    borderBottomRightRadius: '0.5em',
                    background: '#272822',
                    overflowX: 'auto',
                    scrollbarWidth: 'none', /* Hide scrollbar in Firefox */
                    msOverflowStyle: 'none', /* Hide scrollbar in IE/Edge */
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <code
              className={className}
              {...props}
              style={{
                color: '#682bd7',
                backgroundColor: 'rgba(222, 222, 222, 0.3)',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '10px !important',
              }}
            >
              {children}
            </code>
          );
        },
        img({ node, src, alt, ...props }) {
          return (
            <Image
              src={src}
              alt={alt}
              width={500} // Adjust these values as needed
              height={450} // Adjust these values as needed
              layout="responsive"
              objectFit="contain"
              {...props}
            />
          );
        },
        table({ node, ...props }) {
          return (
            <div style={{ overflowX: 'auto', marginBottom: '1em' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderRadius: '4px',
                  border: '3px solid #ddd',
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
            <>
              <h2
                style={{
                  fontSize: '32px',
                  marginBottom: '0.5em',
                  color: '#000',
                }}
                {...props}
              />
                            <GoogleAd /> {/* Inject Google Ad after every <h2> header */}
                            </>

          );
        },
        h3({ node, ...props }) {
          return (
            <h3
              style={{
                fontSize: '24px',
                marginBottom: '0.5em',
                color: '#000', // Change h3 color to #000
              }}
              {...props}
            />
          );
        },
        ul({ node, ...props }) {
          return (
            <ul
              style={{
                color: '#000', // Change bullet points color to #000
              }}
              {...props}
            />
          );
        },
        ol({ node, ...props }) {
          return (
            <ol
              style={{
                color: '#000', // Change numbered list color to #000
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
