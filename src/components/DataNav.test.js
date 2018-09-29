import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DataNav from "./DataNav";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("DataNav", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<DataNav />);

        expect(component).toMatchSnapshot();
    });
});

