import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Button } from '@mui/material';
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  height: 30px;
`

const TextButton = styled(Button)`
  font-size: inherit;
  display: flex;
  font-family: 'Suisse BP Intl, sans-serif';
`

const PageNumber = styled.text`
  display: flex;
  padding: 0 10px;
  text-align: center;
  font-weight: 600;
  margin: 5px;
`

export const DefaultPageSize = 15

interface PageSwitchProps {
  pageNumber: number
  setPageNumber: (n: number) => void
  numberOfElementsLoaded?: number
}

export const PageSwitch = ({ pageNumber, setPageNumber, numberOfElementsLoaded }: PageSwitchProps) => {
  const handlePageSwitch = (direction: 'previous' | 'next') => {
    setPageNumber(direction === 'previous' ? pageNumber - 1 : pageNumber + 1)
  }

  return (
    <Container>
      <TextButton disabled={pageNumber === 1} onClick={() => handlePageSwitch('previous')}>
        <ChevronLeft />
        <span>Previous</span>
      </TextButton>
      <PageNumber>{pageNumber}</PageNumber>
      <TextButton
        disabled={numberOfElementsLoaded !== undefined ? numberOfElementsLoaded < DefaultPageSize : false}
        onClick={() => handlePageSwitch('next')}
      >
        <span>Next</span>
        <ChevronRight />
      </TextButton>
    </Container>
  )
}