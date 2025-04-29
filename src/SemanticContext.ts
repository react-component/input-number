import React from 'react';
import { InputNumberProps } from './InputNumber';

interface SemanticContextProps {
  classNames?: InputNumberProps['classNames'];
  styles?: InputNumberProps['styles'];
}

const SemanticContext = React.createContext<SemanticContextProps | undefined>(undefined);

export default SemanticContext;
