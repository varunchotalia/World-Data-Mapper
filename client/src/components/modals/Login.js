import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from "react-router-dom";
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);
    const history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			props.reloadMaps();
			toggleLoading(false);
			props.setShowLogin(false);
            history.push("/maps");
		};
	};


	return (
		<WModal className="login-modal" cover="true" visible={props.setShowLogin} style={{ backgroundColor: "black",border: "0px"}}>
			<WMHeader  className="modal-header" onClose={() => props.setShowLogin(false)}>
				Login To Your Account
			</WMHeader >

			{
				loading ? <div />
					: <WMMain className="main-login-modal"  >
                        <WRow className="modal-col-gap login-modal" style={{paddingLeft:"130px"}}>
							<WCol size="10">
						        <WInput className="modal-input" style={{color: "white"}} onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
                            </WCol>
                        </WRow>
						<div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap login-modal" style={{paddingLeft:"130px"}}>
							<WCol size="10">
						        <WInput className="modal-input" style={{color: "white"}} onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />
                            </WCol>
                        </WRow>

						{
							showErr ? <div className='modal-error' style={{paddingLeft:"130px"}}>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</WMMain >
			}
			<WMFooter style={{ border: "0px"}}>
				<WButton className="modal-button" style={{ marginLeft:"27px", backgroundColor: "grey"}} onClick={handleLogin} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Login
				</WButton>
                <WButton className="modal-button" style={{ marginLeft:"220px", backgroundColor: "grey"}}  onClick={() => props.setShowLogin(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</WMFooter>
		</WModal >
	);
}

export default Login;