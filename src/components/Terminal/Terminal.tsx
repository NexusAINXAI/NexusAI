import { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  onClose: () => void;
  onSubmit: (duration: number) => void;
}

interface Message {
  text: string;
  type: 'system' | 'user' | 'ai';
  displayText?: string;
  isTyping?: boolean;
}

const isSolanaAddress = (address: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

const walletAnalyses = new Map<string, string>();

const generateWalletAnalysis = (wallet: string): string => {
  if (walletAnalyses.has(wallet)) {
    return walletAnalyses.get(wallet)!;
  }

  const riskScore = Math.floor(Math.random() * 100);
  const getRiskLevel = (score: number) => {
    if (score < 33) return 'Low';
    if (score < 66) return 'Medium';
    return 'High';
  };

  const tradingPatterns = [
    'High frequency trading detected',
    'Long-term holder profile',
    'Active DeFi participant',
    'NFT collector profile',
    'Yield farming strategy'
  ][Math.floor(Math.random() * 5)];

  const protocols = [
    'Raydium',
    'Orca',
    'Magic Eden',
    'Marinade Finance',
    'Jupiter Exchange'
  ];
  const usedProtocols = protocols
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);

  const generatePnL = () => {
    const value = (Math.random() * 40 - 20).toFixed(2);
    return `${value}%`;
  };

  const analysis = `Wallet Analysis Complete ✓

Portfolio Overview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk Factor: ${riskScore}
Risk Level: ${getRiskLevel(riskScore)}
Profile: ${tradingPatterns}

Transaction Activity (Average PnL):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last 24h: ${generatePnL()}
Last 7d: ${generatePnL()}
Last 30d: ${generatePnL()}

Protocol Interaction:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recently Used: ${usedProtocols.join(', ')}

Advanced Metrics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Volatility Index: ${(Math.random() * 50 + 10).toFixed(2)}
Trading Efficiency: ${(Math.random() * 100).toFixed(2)}%
Risk/Reward Ratio: ${(Math.random() * 3 + 0.5).toFixed(2)}
Market Correlation: ${(Math.random() * 100).toFixed(2)}%

Security Status: ${Math.random() > 0.8 ? '⚠️ Suspicious activity detected' : '✓ Normal activity pattern'}`;

  walletAnalyses.set(wallet, analysis);
  return analysis;
};

const generateNetworkStatus = () => {
  const networks = [
    { name: 'Ethereum', price: '$2,247.82', gas: '32 gwei' },
    { name: 'Solana', price: '$95.14', tps: '3,421' },
    { name: 'Arbitrum', price: '$1.68', gas: '0.1 gwei' }
  ];
  
  return `Network Status (Live)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${networks.map(net => 
  net.name === 'Solana' 
    ? `${net.name}: ${net.price} | TPS: ${net.tps}`
    : `${net.name}: ${net.price} | Gas: ${net.gas}`
).join('\n')}

Network Health: Optimal ✓
Block Production: Normal`;
};

const generateMempoolStatus = () => {
  const pendingTx = Math.floor(Math.random() * 200000) + 100000;
  const avgConfirmation = Math.floor(Math.random() * 60) + 30;
  
  return `Mempool Status (Live)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pending Transactions: ${pendingTx.toLocaleString()}
Average Confirmation: ${avgConfirmation} seconds
Network Load: ${Math.random() > 0.5 ? 'High' : 'Moderate'}

Top Protocols by Volume:
1. Jupiter (24h: $127.8M)
2. Raydium (24h: $89.2M)
3. Orca (24h: $45.6M)`;
};

const generateTradeStatus = () => {
  return `Error: Trading temporarily disabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reason: Network congestion detected
Status: Waiting for confirmation of block #${Math.floor(Math.random() * 1000000) + 9000000}
Estimated resolution: 5-10 minutes

Please try again later or use alternative DEX aggregators.`;
};

export function Terminal({ onClose, onSubmit }: TerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "NexusAI Terminal v1.0", type: 'system' },
    { text: "© 2024 NexusAI. All rights reserved.", type: 'system' },
    { text: "", type: 'system' },
    { text: "Welcome to NexusAI Trading Assistant", type: 'ai', displayText: "" },
    { text: "Type 'help' for available commands", type: 'ai', displayText: "" }
  ]);
  const [input, setInput] = useState('');
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  const activeTypingRef = useRef<boolean>(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const updateDimensions = () => {
      const baseWidth = 800;
      const baseHeight = 500;
      const baseScreenWidth = 1920;
      const screenWidth = window.innerWidth;
      const scale = Math.min(1, screenWidth / baseScreenWidth);
      
      setDimensions({
        width: baseWidth * scale,
        height: baseHeight * scale
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const calculateTypingDuration = (text: string): number => {
    const baseSpeed = 30;
    const minDuration = 2000;
    const duration = Math.max(text.length * baseSpeed, minDuration);
    return duration;
  };

  const typeMessage = async (messageIndex: number) => {
    const message = messagesRef.current[messageIndex];
    if (!message || message.type !== 'ai') return;

    const text = message.text;
    let currentChar = 0;
    activeTypingRef.current = true;

    const duration = calculateTypingDuration(text);
    onSubmit(duration);

    const typeChar = () => {
      if (currentChar < text.length && activeTypingRef.current) {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex
            ? { ...msg, displayText: text.slice(0, currentChar + 1), isTyping: true }
            : msg
        ));
        currentChar++;
        typingTimeoutRef.current = setTimeout(typeChar, 30);
      } else {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex
            ? { ...msg, displayText: text, isTyping: false }
            : msg
        ));
        activeTypingRef.current = false;
      }
    };

    typeChar();
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const typeInitialMessages = async () => {
      for (let i = 3; i < messages.length; i++) {
        if (messages[i].type === 'ai') {
          await new Promise<void>(resolve => {
            timeoutId = setTimeout(() => {
              typeMessage(i);
              resolve();
            }, i === 3 ? 100 : 1000);
          });
        }
      }
    };

    typeInitialMessages();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      activeTypingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    setMessages(prev => [...prev, { text: userInput, type: 'user' }]);
    setInput('');

    const [command, ...args] = userInput.split(' ');
    
    let response;
    switch(command.toLowerCase()) {
      case 'help':
        response = `Available commands:
- status: View network status and gas prices
- analysis <wallet>: Get wallet analysis
- mempool: View pending transactions
- trade: Execute a trade
- clear: Clear terminal
- exit: Close terminal`;
        break;
      case 'status':
        setMessages(prev => [...prev, { 
          text: "Fetching network status... ", 
          type: 'ai', 
          displayText: "Fetching network status... ", 
          isTyping: true 
        }]);

        setTimeout(() => {
          const status = generateNetworkStatus();
          setMessages(prev => {
            const filteredMessages = prev.filter(msg => 
              !(msg.type === 'ai' && msg.text === "Fetching network status... ")
            );
            const newMessages = [...filteredMessages, { text: status, type: 'ai', displayText: "" }];
            setTimeout(() => typeMessage(newMessages.length - 1), 100);
            return newMessages;
          });
        }, 9000);
        return;
      case 'mempool':
        setMessages(prev => [...prev, { 
          text: "Scanning mempool... ", 
          type: 'ai', 
          displayText: "Scanning mempool... ", 
          isTyping: true 
        }]);

        setTimeout(() => {
          const mempoolStatus = generateMempoolStatus();
          setMessages(prev => {
            const filteredMessages = prev.filter(msg => 
              !(msg.type === 'ai' && msg.text === "Scanning mempool... ")
            );
            const newMessages = [...filteredMessages, { text: mempoolStatus, type: 'ai', displayText: "" }];
            setTimeout(() => typeMessage(newMessages.length - 1), 100);
            return newMessages;
          });
        }, 8000);
        return;
      case 'trade':
        setMessages(prev => [...prev, { 
          text: "Initializing trade execution... ", 
          type: 'ai', 
          displayText: "Initializing trade execution... ", 
          isTyping: true 
        }]);

        setTimeout(() => {
          const tradeStatus = generateTradeStatus();
          setMessages(prev => {
            const filteredMessages = prev.filter(msg => 
              !(msg.type === 'ai' && msg.text === "Initializing trade execution... ")
            );
            const newMessages = [...filteredMessages, { text: tradeStatus, type: 'ai', displayText: "" }];
            setTimeout(() => typeMessage(newMessages.length - 1), 100);
            return newMessages;
          });
        }, 10000);
        return;
      case 'analysis':
        if (!args.length) {
          response = "Error: Please provide a Solana wallet address";
        } else {
          const wallet = args[0];
          if (isSolanaAddress(wallet)) {
            setMessages(prev => [...prev, { 
              text: "Analyzing wallet... ", 
              type: 'ai', 
              displayText: "Analyzing wallet... ", 
              isTyping: true 
            }]);

            setTimeout(() => {
              const analysis = generateWalletAnalysis(wallet);
              setMessages(prev => {
                const filteredMessages = prev.filter(msg => 
                  !(msg.type === 'ai' && msg.text === "Analyzing wallet... ")
                );
                const newMessages = [...filteredMessages, { text: analysis, type: 'ai', displayText: "" }];
                setTimeout(() => typeMessage(newMessages.length - 1), 100);
                return newMessages;
              });
            }, 10000);
            return;
          } else {
            response = "Error: Invalid Solana wallet address format";
          }
        }
        break;
      case 'clear':
        setMessages([
          { text: "NexusAI Terminal v1.0", type: 'system' },
          { text: "Terminal cleared.", type: 'ai', displayText: "" }
        ]);
        setTimeout(() => typeMessage(1), 100);
        return;
      case 'exit':
        onClose();
        return;
      default:
        response = "Command not recognized. Type 'help' for available commands.";
    }

    setMessages(prev => {
      const newMessages = [...prev, { text: response, type: 'ai', displayText: "" }];
      setTimeout(() => typeMessage(newMessages.length - 1), 500);
      return newMessages;
    });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fontSize = Math.max(12, Math.floor(dimensions.width / 70));

  return (
    <Html
      transform={false}
      prepend
      center
      style={{
        position: 'absolute',
        bottom: '5%',
        left: '50%',
        transform: 'translate(-50%, 95%)',
        cursor: 'auto'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-[#012456] rounded-lg overflow-hidden flex flex-col shadow-2xl"
        style={{ 
          cursor: 'auto',
          width: dimensions.width,
          height: dimensions.height,
          fontSize: `${fontSize}px`
        }}
      >
        <div className="bg-[#0C214E] text-white px-2 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TerminalIcon style={{ width: fontSize, height: fontSize }} />
            <span>NexusAI Terminal</span>
          </div>
          <div className="flex gap-2">
            <button className="hover:bg-[#1C3875] px-2 py-0.5 hover:cursor-pointer">─</button>
            <button className="hover:bg-[#1C3875] px-2 py-0.5 hover:cursor-pointer">□</button>
            <button 
              className="hover:bg-red-600 px-2 py-0.5 hover:cursor-pointer" 
              onClick={onClose}
            >×</button>
          </div>
        </div>

        <div 
          ref={messagesContainerRef}
          className="flex-1 p-2 font-mono overflow-y-auto space-y-1 min-h-0"
          style={{ maxHeight: `calc(${dimensions.height}px - 80px)` }}
        >
          {messages.map((message, i) => (
            <div key={i} className="leading-relaxed min-h-[1.2em]">
              {message.type === 'system' ? (
                <div className="text-white/80">{message.text}</div>
              ) : message.type === 'user' ? (
                <div className="text-white">
                  <span className="text-yellow-400">$</span> {message.text}
                </div>
              ) : (
                <div className="text-cyan-400 whitespace-pre-line min-h-[1.2em]">
                  {message.displayText || ''}
                  {message.isTyping && <span className="animate-pulse">▋</span>}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-2 border-t border-[#1C3875]">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-mono">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white font-mono focus:outline-none"
              style={{ fontSize: `${fontSize}px` }}
              placeholder="Type 'help' for commands..."
            />
          </div>
        </form>
      </motion.div>
    </Html>
  );
}