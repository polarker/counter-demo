import { counterConfig } from "@/services/utils";
import { CounterTypes } from "artifacts/ts";
import { useEffect, useState } from "react";
import { EventSubscription, SubscribeOptions } from "@alephium/web3";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

type EventType = CounterTypes.CountIncreasedEvent | CounterTypes.CountDecreasedEvent

function useCounterEvent(): {
  subscription: EventSubscription | undefined
  events: EventType[]
} {
  const [events, setEvents] = useState<EventType[]>([])
  const [subscription, setSubscription] = useState<EventSubscription | undefined>(undefined)

  useEffect(() => {
    const subscribeOptions: SubscribeOptions<EventType> = {
      pollingInterval: counterConfig.pollingInterval,
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
    const subscription = counterConfig.counter.subscribeAllEvents(subscribeOptions)
    setSubscription((previous) => {
      if (previous !== undefined) previous.unsubscribe()
      return subscription
    })
  }, [])

  return { subscription, events }
}

function formatEvent(event: EventType): string {
  const num = formatUnits(event.fields.num, counterConfig.countDecimals)
  const fields = event.name === 'CountIncreased'
    ? { ...event.fields, num }
    : { ...event.fields, num, rewardAmount: formatUnits((event as CounterTypes.CountDecreasedEvent).fields.rewardAmount, 18) }
  return `Event type: ${event.name}, fields: ${JSON.stringify(fields)}`
}

export const EventList = () => {
  const { events } = useCounterEvent()

  return (
    <List>
      {events.map((event, index) => (
        <ul key={index}>{formatEvent(event)}</ul>
      ))}
    </List>
  );
}
