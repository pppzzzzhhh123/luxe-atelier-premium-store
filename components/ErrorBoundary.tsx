import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">出错了</h1>
              <p className="text-gray-500 text-sm mb-6">
                抱歉，页面遇到了一些问题。我们已经记录了这个错误，请稍后再试。
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full bg-black text-white py-4 px-8 rounded-lg text-sm font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors active:scale-95"
            >
              返回首页
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
