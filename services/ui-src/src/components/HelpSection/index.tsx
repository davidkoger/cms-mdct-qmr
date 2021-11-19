import * as Libs from "libs";
import * as Bootstrap from "react-bootstrap";

export function HelpSection(): JSX.Element {
  return (
    <Bootstrap.Container className="mb-4" data-testid="help-section">
      <h3>Do you have questions or need support?</h3>
      <div className="footer-fed-gov-text">
        For technical questions regarding use of this application, please reach
        out to{" "}
        <a href={`mailto:${Libs.helpDeskContact.email}`}>
          {Libs.helpDeskContact.email}
        </a>
        . For content-related questions, such as about measure specifications or
        what information to enter in each field, please reach out to{" "}
        <a href={`mailto:${Libs.qualityContact.email}`}>
          {Libs.qualityContact.email}
        </a>
      </div>
    </Bootstrap.Container>
  );
}