// Stub exports para componentes NextUI que aún se importan
// Estos son reemplazos temporales para permitir que la app compile

import React from 'react';

export const Text = ({ children, ...props }: any) => React.createElement('span', props, children as any);
export const Button = ({ children, ...props }: any) => React.createElement('button', props, children as any);
export const Input = (props: any) => React.createElement('input', props);
export const Modal = ({ children, ...props }: any) => React.createElement('div', props, children as any);
export const Divider = (props: any) => React.createElement('hr', props);
export const Card = ({ children, ...props }: any) => React.createElement('div', { className: 'border rounded-lg p-4', ...props }, children as any);
export const Container = ({ children, ...props }: any) => React.createElement('div', props, children as any);
export const Select = ({ children, ...props }: any) => React.createElement('select', props, children as any);
export const SelectItem = ({ children, ...props }: any) => React.createElement('option', props, children as any);
export const Spinner = (props: any) => React.createElement('div', props, '⏳');
export const Grid = ({ children, ...props }: any) => React.createElement('div', { className: 'grid', ...props }, children as any);
export const Col = ({ children, ...props }: any) => React.createElement('div', { className: 'col', ...props }, children as any);
export const Row = ({ children, ...props }: any) => React.createElement('div', { className: 'row', ...props }, children as any);
export const User = ({ children, ...props }: any) => React.createElement('div', props, children as any);
export const Tooltip = ({ children, ...props }: any) => React.createElement('div', { title: props.content, ...props }, children as any);
export const Spacer = (props: any) => React.createElement('div', props);
export const Loading = (props: any) => React.createElement('div', props, '⏳ Cargando...');
export const Link = ({ children, ...props }: any) => React.createElement('a', props, children as any);
export const Avatar = (props: any) => React.createElement('div', { className: 'w-8 h-8 rounded-full bg-gray-300', ...props }, props.text);
export const Table = ({ children, ...props }: any) => React.createElement('table', props, children as any);
export const Collapse = ({ children, title, ...props }: any) => 
  React.createElement('div', props, 
    React.createElement('div', null, title),
    React.createElement('div', null, children as any)
  );

export const Dropdown = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Dropdown as any).Trigger = ({ children }: any) => children;
(Dropdown as any).Menu = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Dropdown as any).Item = ({ children, ...props }: any) => React.createElement('button', props, children as any);
(Dropdown as any).Section = ({ children, ...props }: any) => React.createElement('div', props, children as any);

export const Navbar = ({ children, ...props }: any) => React.createElement('nav', props, children as any);
(Navbar as any).Item = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Navbar as any).Content = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Navbar as any).Brand = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Navbar as any).Toggle = ({ children, ...props }: any) => React.createElement('button', props, children as any);

export const Switch = (props: any) => React.createElement('input', { type: 'checkbox', ...props });

export const styled = (element: string, styles: any) => {
  return React.forwardRef<any, any>(({ as, ...props }, ref) => 
    React.createElement(as || element, { ref, ...props })
  );
};

export function globalCss(styles: any) {
  return () => null;
}

export const useTheme = () => ({
  isDark: false,
  type: 'light',
});

export const NextUIProvider = ({ children }: any) => React.createElement(React.Fragment, null, children as any);
