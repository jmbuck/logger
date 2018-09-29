import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DeleteAccountPanel from "./DeleteAccountPanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("DeleteAccountPanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<DeleteAccountPanel />);

        expect(component).toMatchSnapshot();
    });
});

