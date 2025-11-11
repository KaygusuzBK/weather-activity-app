'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center h-full min-h-[400px] p-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: '#A25B5B' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
              Bir Hata Oluştu
            </h2>
            <p className="text-sm mb-4" style={{ color: '#2C2C2C', opacity: 0.7 }}>
              {this.state.error?.message || 'Beklenmeyen bir hata oluştu'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 mx-auto"
              style={{
                backgroundColor: '#809A6F',
                color: '#D5D8B5',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar Dene
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

