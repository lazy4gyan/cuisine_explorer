import { GO_BACK_HOME_MESSAGE, PAGE_NOT_FOUND_MESSAGE, SORRY_MESSAGE } from '../../utils/helper';
import './Error.css'; 

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>{PAGE_NOT_FOUND_MESSAGE}</h1>
      <p>{SORRY_MESSAGE}</p>
      <a href="/" className="back-home">{GO_BACK_HOME_MESSAGE}</a>
    </div>
  );
};

export default ErrorPage;