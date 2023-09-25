import { TimelineTweet } from './tweet';
import { TimelineUser } from './user';

export * from './tweet';
export * from './user';

export interface EntityURL {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export type TimelineInstructions = Array<
  | TimelineClearCacheInstruction
  | TimelineTerminateTimelineInstruction
  | TimelinePinEntryInstruction
  | TimelineAddEntriesInstruction
  | TimelineAddToModuleInstruction
>;

export interface TimelineClearCacheInstruction {
  type: 'TimelineClearCache';
}

export interface TimelineTerminateTimelineInstruction {
  type: 'TimelineTerminateTimeline';
  direction: 'Top' | 'Bottom';
}

export interface TimelineEntry<
  T = TimelineTweet | TimelineUser,
  C = TimelineTimelineItem<T> | TimelineTimelineModule<T> | TimelineTimelineCursor,
> {
  content: C;
  entryId: string;
  sortIndex: string;
}

export interface TimelinePinEntryInstruction {
  type: 'TimelinePinEntry';
  entry: TimelineEntry<TimelineTweet, TimelineTimelineItem<TimelineTweet>>;
}

export interface TimelineAddEntriesInstruction<T = TimelineTweet | TimelineUser> {
  type: 'TimelineAddEntries';
  entries: TimelineEntry<T>[];
}

export interface TimelineAddToModuleInstruction<T = TimelineTweet | TimelineUser> {
  type: 'TimelineAddToModule';
  // "conversationthread-{cid}"
  moduleEntryId: string;
  prepend: boolean;
  moduleItems: {
    // "conversationthread-{id}-tweet-{tid}"
    entryId: string;
    item: {
      clientEventInfo: unknown;
      itemContent: T;
    };
  }[];
}

// TimelineEntry.entryId: "tweet-{id}"
// TimelineEntry.entryId: "user-{id}"
export interface TimelineTimelineItem<T = TimelineTweet | TimelineUser> {
  entryType: 'TimelineTimelineItem';
  __typename: 'TimelineTimelineItem';
  itemContent: T;
  clientEventInfo: unknown;
}

// TimelineEntry.entryId: "cursor-top-{id}"
// TimelineEntry.entryId: "cursor-bottom-{id}"
export interface TimelineTimelineCursor {
  entryType: 'TimelineTimelineCursor';
  __typename: 'TimelineTimelineCursor';
  value: string;
  cursorType: 'Top' | 'Bottom' | 'ShowMore' | 'ShowMoreThreads';
}

// TimelineEntry.entryId: "who-to-follow-{id}"
// TimelineEntry.entryId: "profile-conversation-{id}"
// TimelineEntry.entryId: "conversationthread-{id}"
// TimelineEntry.entryId: "tweetdetailrelatedtweets-{id}"
export interface TimelineTimelineModule<T = TimelineTweet | TimelineUser | TimelineTimelineCursor> {
  entryType: 'TimelineTimelineModule';
  __typename: 'TimelineTimelineModule';
  clientEventInfo: unknown;
  displayType: 'Vertical' | 'VerticalConversation' | string;
  items: {
    // "who-to-follow-{id}-user-{uid}"
    // "profile-conversation-{id}-tweet-{tid}"
    // "conversationthread-{id}-tweet-{tid}"
    // "conversationthread-{id}-cursor-showmore-{cid}"
    // "tweetdetailrelatedtweets-{id}-tweet-{tid}"
    entryId: string;
    item: {
      clientEventInfo: unknown;
      itemContent: T;
    };
  }[];
  header?: unknown;
  metadata?: {
    conversationMetadata: {
      allTweetIds: string[];
      enableDeduplication: boolean;
    };
  };
}
