import { useCallback, useState } from 'react';

const useVisible = (initialValue: boolean | undefined = false) => {
  const [visible, setVisible] = useState(initialValue);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible((prev) => !prev), []);

  return { visible, show, hide, toggle };
};

export default useVisible;
