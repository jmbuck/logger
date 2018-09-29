import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DataPanel from "./DataPanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("DataPanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<DataPanel />);

        expect(component).toMatchSnapshot();
    });
});

