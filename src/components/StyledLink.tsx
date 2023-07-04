import React from 'react';
import styled from 'styled-components';

interface ExternalLinkProps {
  to: string
  children: React.ReactNode
}

const StyledLink = styled.a`
  text-decoration: underline;
  cursor: pointer;
`

const ExternalLink: React.FC<ExternalLinkProps> = ({ to, children }) => {
  return (
    <StyledLink href={to} target="_blank">
      {children}
    </StyledLink>
  )
}

export default ExternalLink