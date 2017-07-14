const chai = require('chai');
const lib = require('../../dist');

const expect = chai.expect;

describe('Integration tests', () => {
    describe('#getEventSummaries', () => {
        it('should be able to fetch all event summaries', done => {
            lib
                .getEventSummaries()
                .then(events => {
                    expect(events.length).to.be.greaterThan(0);
                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });
    });

    describe('#getCarEventSummaries', () => {
        it('should be able to fetch all car event summaries', done => {
            lib
                .getCarEventSummaries()
                .then(events => {
                    expect(events.length).to.be.greaterThan(0);
                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });

        it('should only contain car events', done => {
            lib
                .getCarEventSummaries()
                .then(events => {
                    for (const event of events) {
                        expect(event.vehicleType).to.be.equal('CAR');
                    }

                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });
    });

    describe('#getBikeEventSummaries', () => {
        it('should be able to fetch all bike event summaries', done => {
            lib
                .getBikeEventSummaries()
                .then(events => {
                    expect(events.length).to.be.greaterThan(0);
                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });

        it('should only contain bike events', done => {
            lib
                .getBikeEventSummaries()
                .then(events => {
                    for (const event of events) {
                        expect(event.vehicleType).to.be.equal('BIKE');
                    }

                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });
    });
});
