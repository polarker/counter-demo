import { globalConfig } from "@/utils";
import { ElectricityTypes } from "artifacts/ts";
import { useEffect, useState } from "react";
import { EventSubscription, SubscribeOptions } from "@alephium/web3";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

type EventType = ElectricityTypes.ElectricityProducedEvent | ElectricityTypes.ElectricityConsumedEvent

function useElectricityEvent(): {
  subscription: EventSubscription | undefined
  events: EventType[]
} {
  const [events, setEvents] = useState<EventType[]>([])
  const [subscription, setSubscription] = useState<EventSubscription | undefined>(undefined)

  useEffect(() => {
    const subscribeOptions: SubscribeOptions<EventType> = {
      pollingInterval: globalConfig.pollingInterval,
      messageCallback: (event) => {
        setEvents((current) => [...current, event])
        return Promise.resolve()
      },
      errorCallback: (err, subscription) => {
        console.error(`subscription error: ${err}`)
        subscription.unsubscribe()
        return Promise.resolve()
      }
    }
    const subscription = globalConfig.electricity.subscribeAllEvents(subscribeOptions)
    setSubscription((previous) => {
      if (previous !== undefined) previous.unsubscribe()
      return subscription
    })
  }, [])

  return { subscription, events }
}

function formatEvent(event: EventType): string {
  const num = formatUnits(event.fields.num, globalConfig.countDecimals)
  switch (event.name) {
    case 'ElectricityProduced':
      return `ElectricityProduced: ${num} kWh`
    case 'ElectricityConsumed':
      return `ElectricityConsumed: ${num} kWh, rewardAmount: ${formatUnits((event as ElectricityTypes.ElectricityConsumedEvent).fields.rewardAmount, 18)} ${globalConfig.tokenSymbol}`
    default:
      return ``
  }
}

export const EventList = () => {
  const { events } = useElectricityEvent()

  return (
    <List>
      {events.map((event, index) => (
        <ul key={index}>{formatEvent(event)}</ul>
      ))}
    </List>
  );
}
