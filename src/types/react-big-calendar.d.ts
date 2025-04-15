
declare module 'react-big-calendar' {
  import { ComponentType, ReactNode, CSSProperties } from 'react';
  
  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

  export interface Views {
    MONTH: 'month';
    WEEK: 'week';
    WORK_WEEK: 'work_week';
    DAY: 'day';
    AGENDA: 'agenda';
  }

  export interface Event {
    id?: string | number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }

  export interface SlotInfo {
    start: Date;
    end: Date;
    slots: Date[];
    action: 'select' | 'click' | 'doubleClick';
    bounds?: {
      x: number;
      y: number;
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    box?: {
      clientX: number;
      clientY: number;
      x: number;
      y: number;
    };
  }

  export interface CalendarProps {
    localizer: any;
    events: Event[];
    views?: View[];
    view?: View;
    date?: Date;
    length?: number;
    toolbar?: boolean;
    popup?: boolean;
    popupOffset?: number | { x: number; y: number };
    selectable?: boolean;
    resizable?: boolean;
    longPressThreshold?: number;
    step?: number;
    timeslots?: number;
    rtl?: boolean;
    eventPropGetter?: (event: Event, start: Date, end: Date, isSelected: boolean) => { style?: CSSProperties, className?: string };
    slotPropGetter?: (date: Date) => { style?: CSSProperties, className?: string };
    dayPropGetter?: (date: Date) => { style?: CSSProperties, className?: string };
    showMultiDayTimes?: boolean;
    min?: Date;
    max?: Date;
    scrollToTime?: Date;
    culture?: string;
    formats?: any;
    components?: {
      event?: ComponentType<any>;
      eventWrapper?: ComponentType<any>;
      dayWrapper?: ComponentType<any>;
      dateCellWrapper?: ComponentType<any>;
      toolbar?: ComponentType<any>;
      agenda?: {
        date?: ComponentType<any>;
        time?: ComponentType<any>;
        event?: ComponentType<any>;
      };
      day?: {
        header?: ComponentType<any>;
        event?: ComponentType<any>;
      };
      week?: {
        header?: ComponentType<any>;
        event?: ComponentType<any>;
      };
      month?: {
        header?: ComponentType<any>;
        dateHeader?: ComponentType<any>;
        event?: ComponentType<any>;
      };
    };
    messages?: any;
    defaultView?: View;
    defaultDate?: Date;
    style?: CSSProperties;
    className?: string;
    elementProps?: any;
    backdropClassName?: string;
    dragOffset?: number;
    startAccessor?: ((event: Event) => Date) | string;
    endAccessor?: ((event: Event) => Date) | string;
    titleAccessor?: ((event: Event) => string) | string;
    allDayAccessor?: ((event: Event) => boolean) | string;
    resourceAccessor?: ((event: Event) => any) | string;
    resourceIdAccessor?: ((resource: any) => string | number) | string;
    resourceTitleAccessor?: ((resource: any) => string) | string;
    getNow?: () => Date;
    onNavigate?: (newDate: Date, view: View, action: any) => void;
    onView?: (view: View) => void;
    onDrillDown?: (date: Date, view: View) => void;
    onSelectSlot?: (slotInfo: SlotInfo) => void;
    onDoubleClickEvent?: (event: Event, e: React.SyntheticEvent) => void;
    onSelectEvent?: (event: Event, e: React.SyntheticEvent) => void;
    onSelecting?: (range: { start: Date, end: Date }) => boolean | undefined | null;
    selected?: any;
    resources?: Array<any>;
    onKeyPressEvent?: (event: Event, e: React.SyntheticEvent) => void;
    onRangeChange?: (range: { start: Date, end: Date }, view: View) => void;
    onEventDrop?: (args: { event: Event, start: Date, end: Date, allDay: boolean }) => void;
    onEventResize?: (args: { event: Event, start: Date, end: Date }) => void;
  }

  export class Calendar extends React.Component<CalendarProps> {}

  export function momentLocalizer(moment: any): any;
}
