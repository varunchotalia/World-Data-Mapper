import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
			}
			props.setShowCreate(false);
		};
	};

	return (
		<WModal className="signup-modal"  cover="true" visible={props.setShowCreate}>
			<WMHeader  className="modal-header" onClose={() => props.setShowCreate(false)}>
				Create A New Account
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
							<WRow className="modal-col-gap signup-modal" style={{paddingLeft:"130px"}}>
								<WCol size="10">
									<WInput 
										className="" style={{color:"white"}} onBlur={updateInput} name="name" labelAnimation="up" 
										barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
									/>
								</WCol>
							</WRow>

							<div className="modal-spacer">&nbsp;</div>
					<WRow style={{paddingLeft:"130px"}}>
                        <WCol size="10">	
                            <WInput 
								className="modal-input" style={{color:"white"}} onBlur={updateInput} name="email" labelAnimation="up" 
								barAnimation="solid" labelText="Email" wType="outlined" inputType="text" 
							/>
                            </WCol>
                     </WRow>
                     <WRow  style={{paddingLeft:"130px"}}>
                         <WCol size="10">
							<div className="modal-spacer">&nbsp;</div>
							<WInput 
								className="modal-input" style={{color:"white"}} onBlur={updateInput} name="password" labelAnimation="up" 
								barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
							/>
                        </WCol>
                    </WRow>
					</WMMain>
			}
			<WMFooter style={{border: "0px"}}>
				<WButton className="modal-button" style={{marginLeft:"27px", backgroundColor: "grey"}} size="medium"  onClick={handleCreateAccount}  clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Create Account
				</WButton>
                <WButton className="modal-button" style={{marginLeft:"180px", backgroundColor: "grey"}} size="medium" onClick={() => props.setShowCreate(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</WMFooter>
			
		</WModal>
	);
}

export default CreateAccount;
