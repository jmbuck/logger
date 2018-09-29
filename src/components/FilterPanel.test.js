import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FilterPanel from "./FilterPanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("FilterPanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<FilterPanel />);

        expect(component).toMatchSnapshot();
    });
});

