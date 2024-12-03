import React from 'react';

// Create Document Component
// eslint-disable-next-line react/display-name
const ComponentToPrint = React.forwardRef((props, ref) => {
	const control = props.control;
	const nfact = props.nfact;
	const userInfo = props.userInfo;
	const getPageMargins = () => {
		const marginTop = '160px';
		const marginRight = '75px';
		const marginBottom = '0px';
		const marginLeft = '70px';
		return `@page { margin: ${marginTop} ${marginRight}  ${marginBottom} ${marginLeft}}`;
	};
	console.log("control:", control)
	return (
		<div ref={ref}>
			<style>{getPageMargins()}</style>
			<div>
				<div>
					<div>
						<div className='encabezado-print'>
							<div>
								<p>
									<strong>Numero de R.I.F.: </strong>
									{control.paciente.cedula}
									<br />
									<strong>Nombre o Razon Social: </strong>{' '}
									{control.paciente.nombre}
									<br />
									<strong>Direccion Fiscal: </strong>
									{control.paciente.direccion}
									<br />
									<strong>Telefonos: </strong>
									{control.paciente.telefono}
									<br />
								</p>
							</div>
							<div>
								<p>
									<strong>Factura Numero:</strong> {nfact} <br />
									<strong>Fecha de Emision:</strong>{' '}
									{props.control.createdAt}
									<br />
									<strong>Vencimiento:</strong>{' '}
									{props.control.createdAt}
									<br />
									<strong>Condiciones: </strong>
									De Contado <br />
								</p>
							</div>
						</div>
						<div className='titulos-detalle-print'>
							<p className='titulo-detalle-codigo'>Cantidad</p>
							<p className='titulo-detalle-desc'>Descripcion</p>
							<p className='titulo-detalle-precio'>Precio Unitario</p>
							<p className='titulo-detalle-total'>Monto Bs.</p>
						</div>
						<ul>
							<li>
								<div>
									<ul>
										{control.serviciosItems.map((item, inx) => (
											<li className='separator-print' key={inx}>
												<div className='row print'>
													<div className='qty print'>
														<p>{item.cantidad}</p>
													</div>

													<div className='descripcion-print'>
														<span className='nombre-marca-print'>
															{item.servicio.nombre}
														</span>
														<p id='mini-descripcion'>
															Atendido por: Dr. {control.doctor.nombre}
														</p>
													</div>

													<div className='qty-price print'>
														<p>
															{(item.precioServ * control.cambioBcv).toFixed(2)}
														</p>
													</div>
													<div className='qty-price total'>
														<p>
															{(
																item.cantidad *
																item.precioServ *
																control.cambioBcv
															).toFixed(2)}
														</p>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>
							</li>
						</ul>
					</div>
					<div>
						<br></br>
					</div>

					<div className='bottom-section-print'>
						<div className='totales-print'>
							<div className='bottom-resumen-print'>
								<ul className='ul-resumen-print'>
									<li>
										<div className='flx'>
											<div>Base Imponible</div>
											<div>{control.montoBs.toFixed(2)}</div>
										</div>
									</li>

									<hr />
									<li>
										<div className='flx'>
											<div>Monto Exento:</div>
											<div>Bs. {0.0}</div>
										</div>
									</li>
									<hr />
									<li>
										<div className='flx'>
											<div>I.V.A. 16%</div>
											<div>Bs.{control.montoIva.toFixed(2)}</div>
										</div>
									</li>
									<hr />
									<li>
										<div className='flx'>
											<div>
												<strong>Total</strong>
											</div>
											<div>Bs.{control.totalGeneralBs.toFixed(2)}</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default ComponentToPrint;
