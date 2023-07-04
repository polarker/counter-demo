import { globalConfig } from "@/utils";
import { Electricity, ElectricityTypes } from "artifacts/ts";
import { web3, explorer, fromApiVals } from "@alephium/web3";
import { DefaultPageSize, PageSwitch } from "./PageSwitch";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import styled from "styled-components";
import ListEvents from "./ListEvents";

export type EventType = ElectricityTypes.ElectricityProducedEvent | ElectricityTypes.ElectricityConsumedEvent

function toElectricityEvent(event: explorer.Event): EventType | undefined {
  const eventSig = Electricity.contract.eventsSig[event.eventIndex]
  if (event.fields === undefined || event.fields.length !== eventSig.fieldNames.length) {
    console.error(`invalid event: ${JSON.stringify(event)}`)
    return undefined
  }
  const fields = fromApiVals(event.fields, eventSig.fieldNames, eventSig.fieldTypes)
  return {
    txId: event.txHash,
    blockHash: event.blockHash,
    contractAddress: event.contractAddress,
    eventIndex: event.eventIndex,
    name: eventSig.name,
    fields
  } as EventType
}

async function getEvents(page: number): Promise<EventType[]> {
  const provider = web3.getCurrentExplorerProvider()
  if (provider === undefined) {
    throw new Error(`no explorer provider specified`)
  }
  const contractAddress = globalConfig.electricity.address
  const events = await provider.contractEvents.getContractEventsContractAddressContractAddress(contractAddress, { page, limit: DefaultPageSize })
  return events.map((event) => toElectricityEvent(event)).filter((e) => e !== undefined) as EventType[]
}

export const EventList = () => {
  const [currentEvents, setCurrentEvents] = useState<EventType[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const events = await getEvents(pageNumber)
        setCurrentEvents(events)
      } catch (error) {
        enqueueSnackbar(`Failed to get events, error: ${error}`, { persist: true, variant: 'error' })
      }
    }, globalConfig.pollingInterval)

    return () => { clearInterval(interval) }
  }, [pageNumber, enqueueSnackbar])

  return (
    <Container>
      <ListEvents events={currentEvents}/>
      <PageSwitch
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        numberOfElementsLoaded={currentEvents.length}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 50%;
`
