// Stub exports para componentes NextUI que aún se importan
// Estos son reemplazos temporales para permitir que la app compile

import React from 'react';

export const Text: any = ({ children, ...props }: any) => React.createElement('span', props, children as any);
export const Button: any = ({ children, ...props }: any) => React.createElement('button', props, children as any);
export const Input: any = (props: any) => React.createElement('input', props);
export const Modal: any = ({ children, ...props }: any) => React.createElement('div', props, children as any);
export const Divider = (props: any) => React.createElement('hr', props);
export const Card: any = ({ children, ...props }: any) => React.createElement('div', { className: 'border rounded-lg p-4', ...props }, children as any);
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
export const Table: any = ({ children, ...props }: any) => React.createElement('table', props, children as any);
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

// ==========================================
// STUBS ADICIONALES
// ==========================================
export const Badge = ({ children, ...props }: any) =>
  React.createElement('span', { className: 'inline-block px-2 py-0.5 text-xs rounded bg-gray-200', ...props }, children as any);

export const Progress = (props: any) =>
  React.createElement('progress', { value: props.value || 0, max: props.max || 100, ...props });

export const CssBaseline = { flush: () => null };

export type CSS = any;

export const createTheme = (config: any) => ({ className: '', theme: config?.theme || {}, type: config?.type || 'light' });

// Subcomponents para Modal
(Modal as any).Header = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Modal as any).Body = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Modal as any).Footer = ({ children, ...props }: any) => React.createElement('div', props, children as any);

// Subcomponents para Card
(Card as any).Header = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Card as any).Body = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Card as any).Footer = ({ children, ...props }: any) => React.createElement('div', props, children as any);
(Card as any).Image = (props: any) => React.createElement('img', props);

// Subcomponents para Table
(Table as any).Header = ({ children, ...props }: any) => React.createElement('thead', props, children as any);
(Table as any).Column = ({ children, ...props }: any) => React.createElement('th', props, children as any);
(Table as any).Body = ({ children, ...props }: any) => React.createElement('tbody', props, children as any);
(Table as any).Row = ({ children, ...props }: any) => React.createElement('tr', props, children as any);
(Table as any).Cell = ({ children, ...props }: any) => React.createElement('td', props, children as any);
(Table as any).Pagination = ({ children, ...props }: any) => React.createElement('div', props, children as any);

// Subcomponents para Input
(Input as any).Password = (props: any) => React.createElement('input', { type: 'password', ...props });

// Subcomponents para Button
(Button as any).Group = ({ children, ...props }: any) => React.createElement('div', props, children as any);

// Subcomponents para Text
(Text as any).Heading = ({ children, ...props }: any) => React.createElement('h2', props, children as any);

export const Pagination = (props: any) => React.createElement('div', props);
export const Radio = (props: any) => React.createElement('input', { type: 'radio', ...props });
(Radio as any).Group = ({ children, ...props }: any) => React.createElement('div', props, children as any);
export const Checkbox = (props: any) => React.createElement('input', { type: 'checkbox', ...props });
(Checkbox as any).Group = ({ children, ...props }: any) => React.createElement('div', props, children as any);
export const Textarea = (props: any) => React.createElement('textarea', props);

