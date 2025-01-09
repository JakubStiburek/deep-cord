import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline";
import vis from "vis-data";
import { DateTime } from "luxon";

import { Record } from "../../record/types";
import { DashboardPaper } from "@/modules/common/layouts/dashboard-paper";

const secondsToDate = (seconds: number, baseDate = "2014-04-20T00:00:00Z") => {
  const base = DateTime.fromISO(baseDate, { zone: "utc" }) // Výchozí UTC čas
    .plus({ seconds });

  const day = base.toFormat("yyyy-MM-dd HH:mm:ss");

  return day;
};

const mockRecord: Record = {
  id: "1234",
  label: "My first record",
  annotationTiers: [
    {
      annotations: [
        {
          id: "1",
          value: "Person 1",
          meta: {},
          type: "something",
          span: { start: 11.23, end: 16.34 },
        },
        {
          id: "2",
          value: "Person 1",
          meta: {},
          type: "something",
          span: { start: 17, end: 20.5 },
        },
      ],
    },
  ],
  file: { uri: "./testing-file.mp3" },
};

const toTimelineFormat = (
  records: Record["annotationTiers"][0]["annotations"]
) => {
  return records.map((record) => ({
    id: record.id,
    content: record.value,
    type: "range",
    start: secondsToDate(record.span.start),
    end: secondsToDate(record.span.end),
  }));
};

const items = new vis.DataSet(
  toTimelineFormat(mockRecord.annotationTiers[0].annotations)
);

const VisTimeline = () => {
  const visJsRef = useRef(null);

  useEffect(() => {
    if (visJsRef.current) {
      new Timeline(visJsRef.current, items, {
        max: "2014-04-20 00:00:31",
        min: "2014-04-20 00:00:00",
        zoomMin: 1000, // Minimum zoom level (1 second)
        zoomMax: 3600000,
        zoomable: true,
        preferZoom: true,
        zoomFriction: 5,
        minHeight: 150,
        showCurrentTime: true,
        showWeekScale: false,
        showMajorLabels: false,
      });
    }

    return () => {
      visJsRef.current = null;
    };
  }, []);
  return <div ref={visJsRef} />;
};

export function RecordDetailPage() {
  //   const [record, setRecord] = useState();

  //   const fetchRecord = async () => {
  //     try {
  //       const response = await axios.get(`https://example.com/user`);
  //       setRecord(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchRecord();
  //   }, []);

  return (
    <DashboardPaper>
      <h2 className="text-xl">Label: {mockRecord.label}</h2>
      <h3 className="text-md text-muted-foreground">
        URI: {mockRecord.file.uri}
      </h3>
      <div className="flex flex-col p-4 gap-4">
        <VisTimeline />
      </div>
    </DashboardPaper>
  );
}
