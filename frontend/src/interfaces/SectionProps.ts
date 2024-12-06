import React from 'react';

export default interface SectionProps {
  title: string;
  text: React.ReactNode;
  image: string;
  reversed?: boolean;
}
