import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: true,
};

const sidePanelSlice = createSlice({
    name: "sidePanel",
    initialState,
    reducers: {
        openPanel: (state) => {
            state.isOpen = !state.isOpen;
        },
        keepOpen: (state) => {
            state.isOpen = true;
        },
    },
});

export const { openPanel , keepOpen} = sidePanelSlice.actions;
export default sidePanelSlice.reducer;
