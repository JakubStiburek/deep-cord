import { useEffect, useRef } from "react";
import { Timeline as VisTimeline } from "vis-timeline";
import { DataSet } from "vis-data";
import { DateTime } from "luxon";

import { Record as DeepcordRecord } from "@/modules/record/types";

const BASE_TIME = DateTime.fromObject({
  year: 1970,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
  second: 0,
}).toJSDate();

const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
// const DATE_TIME_FORMAT_MILLIS = "yyyy-MM-dd HH:mm:ss.SSS";

const addSecondsToDate = (seconds: number, baseDate = BASE_TIME) => {
  const base = DateTime.fromJSDate(baseDate).plus({ seconds });

  const day = base.toFormat(DATE_TIME_FORMAT);

  return day;
};

// const addMilisToDate = (milliseconds: number, baseDate = BASE_TIME): string => {
//   const base = DateTime.fromJSDate(baseDate).plus({ milliseconds });

//   const day = base.toFormat(DATE_TIME_FORMAT_MILLIS);

//   return day as string;
// };

const toTimelineFormat = (
  annotations: DeepcordRecord["annotationTiers"][number]["annotations"]
) => {
  return annotations.map((annotation) => {
    return {
      id: annotation.id,
      content: String(annotation.value || "No content"),
      group: 0,
      type: "range",
      start: addSecondsToDate(annotation.span.start),
      end: addSecondsToDate(annotation.span.end),
    };
  });
};

const processItems = (record: DeepcordRecord) =>
  new DataSet(toTimelineFormat(record.annotationTiers[0].annotations));

var groups = new DataSet([
  { id: 0, content: "Transcript", value: 1 },
  { id: 1, content: "Something", value: 3 },
  { id: 2, content: "Something else", value: 2 },
]);

export const EditorTimeline = ({
  record,
  currentTime,
  onSeek,
  // zoom,
  // setZoom,
  duration,
}: {
  record?: any;
  currentTime: number;
  onSeek: (time: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  duration: number;
}) => {
  const visJsRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<VisTimeline | null>(null);

  useEffect(() => {
    if (visJsRef.current) {
      const timeline = new VisTimeline(visJsRef.current, processItems(record), {
        max: addSecondsToDate(duration),
        min: DateTime.fromJSDate(BASE_TIME).toFormat(DATE_TIME_FORMAT),
        start: DateTime.fromJSDate(BASE_TIME).toFormat(DATE_TIME_FORMAT),
        end: addSecondsToDate(duration),
        zoomMin: 1000,
        zoomMax: 360000,
        zoomable: true,
        moveable: true,
        preferZoom: true,
        zoomFriction: 5,
        minHeight: 150,

        snap: (date) => {
          return date;
        },
        showWeekScale: false,
        showMajorLabels: false,
      });

      timelineRef.current = timeline;
      timeline.on("click", ({ time }) => {
        const newTime = DateTime.fromJSDate(time).diff(
          DateTime.fromJSDate(BASE_TIME),
          "seconds"
        ).seconds;

        onSeek(newTime);
      });
      timeline.addCustomTime(BASE_TIME, "custom-time-bar");
      timeline.moveTo(BASE_TIME);
      timeline.setGroups(groups);

      return () => timeline.destroy();
    }
  }, []);

  useEffect(() => {
    if (timelineRef.current && currentTime !== undefined) {
      const formattedTime = DateTime.fromJSDate(BASE_TIME)
        .plus({
          milliseconds: currentTime * 1000,
        })
        .toJSDate();

      try {
        timelineRef.current.setCustomTime(formattedTime!, "custom-time-bar");
      } catch (err) {
        console.log(err);
      }
    }
  }, [currentTime]);

  //   useEffect(() => {
  //     if (timelineRef.current) {
  //       const timeline = timelineRef.current;
  //       timeline.on("rangechange", () => {
  //         const range = timeline.getWindow();
  //         const visibleDuration = range.end.valueOf() - range.start.valueOf();

  //         const zoomFactor = Math.ceil(
  //           (visibleDuration / (duration * 1000)) * 1000
  //         );

  //         setZoom(1000 - zoomFactor);
  //       });
  //     }
  //   }, []);

  //   useEffect(() => {
  //     const timeline = timelineRef.current;
  //     if (timeline) {
  //       const range = timeline.getWindow();
  //       const visibleDuration = range.end.valueOf() - range.start.valueOf();

  //       const zoomFactor = Math.ceil(visibleDuration / duration);

  //       const eee = (1000 - Math.ceil(zoom)) / 1000;

  //       if (1000 - zoomFactor !== zoom) {
  //         timeline.zoomIn(eee, { animation: false });
  //       }
  //     }
  //   }, [zoom]);

  return <div ref={visJsRef} className={"w-full"} />;
};
