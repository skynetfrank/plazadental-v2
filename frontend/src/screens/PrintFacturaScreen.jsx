import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsControl } from '../actions/controlActions';
import ComponentToPrint from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

export default function PrintFacturaScreen(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const params = useParams();
  const { id: controlId } = params;
  const [nfact, setNfact] = useState('');

  const controlDetails = useSelector(state => state.controlDetails);
  const { control, loading, error } = controlDetails;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!control || (control && control._id !== controlId)) {
      dispatch(detailsControl(controlId));
    }
  }, [dispatch, controlId, control]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="printer-container">
      <div className="factura">
        <div class="input-group">
          <input
            type="text"
            className="input small"
            autoComplete="off"
            placeholder=" "
            value={nfact}
            required
            onChange={e => setNfact(e.target.value)}
          />
          <label htmlFor="cedula" class="user-label">
            Factura No.
          </label>
        </div>
        <button className="btn-print" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} />
        </button>
      </div>
      <ComponentToPrint control={control} nfact={nfact} userInfo={userInfo} ref={componentRef} />
    </div>
  );
}
