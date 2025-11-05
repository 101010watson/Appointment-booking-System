import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', fullWidth = false, loading = false, ...props }) => {
  const baseStyles =
    'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  // Avoid forwarding `loading` to the DOM (React warns for non-boolean attributes)
  const isDisabled = props.disabled || loading;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${className}`.trim()}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
