import React, { useState } 	from 'react';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const MapName = (props) =>{

    const [name, setName] = useState("");

    const updateName = (e) =>{
        setName(e.target.value);
    }

    const handleSubmit = () =>{
        props.createNewMap(name);
        props.setShowMapName(false)
    }

	return (
		<WModal className="login-modal" cover="true" visible={props.setShowMapName} style={{ backgroundColor: "black",border: "0px"}}>
			<WMHeader  className="modal-header" onClose={() => props.setShowMapName(false)}>
				Add New Map
			</WMHeader >				
					 <WMMain className="main-login-modal"  >
                        <WRow className="modal-col-gap login-modal" style={{paddingLeft:"130px"}}>
							<WCol size="10">
						        <WInput className="modal-input" style={{color: "white"}} onBlur={updateName} name='name' labelAnimation="up" barAnimation="solid" labelText="Name" wType="outlined" inputType='text' />
                            </WCol>
                        </WRow>
					</WMMain >
			
			<WMFooter style={{ border: "0px"}}>
				<WButton className="modal-button" style={{ marginLeft:"27px", backgroundColor: "grey"}} onClick={handleSubmit} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Submit
				</WButton>
                <WButton className="modal-button" style={{ marginLeft:"220px", backgroundColor: "grey"}}  onClick={() => props.setShowMapName(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</WMFooter>
		</WModal >
	);
}

export default MapName;