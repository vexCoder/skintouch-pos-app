import React from "react";
import styled from "styled-components";
import { grey } from "@ant-design/colors";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid ${grey[3]};

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.1rem 0.5rem 0.1rem 0.5rem;
      border-bottom: 1px solid ${grey[3]};
      border-right: 1px solid ${grey[3]};

      :last-child {
        border-right: 0;
      }
    }
  }
`;

export default function Table(props) {
  const { data, columns, summary } = props;
  return (
    <Styles>
      <table {...props} style={{ width: "100%" }}>
        <tr>
          {columns.map((val) => (
            <th key={val.key} style={{ ...val.style }}>
              {val.title}
            </th>
          ))}
        </tr>
        {data.map((val, index) => (
          <tr key={val.key}>
            {columns.map((col) => (
              <td key={val.key + col.key + index} style={{ ...col.style }}>
                {val[col.key]}
              </td>
            ))}
          </tr>
        ))}
        {summary.map((val, index) => (
          <tr>
            <th key={index} colSpan={val.labelSpan} style={{ ...val.style }}>
              {val.label}
            </th>
            <td key={index} colSpan={val.valueSpan} style={{ ...val.style }}>
              {val.value}
            </td>
          </tr>
        ))}
      </table>
    </Styles>
  );
}
