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

    describe('#getCarEventSummariesAtVenue', () => {
        it('should only contain car events for the given venue', done => {
            const venueName = 'Silverstone';

            lib
                .getCarEventSummariesAtVenue(venueName)
                .then(events => {
                    const hasEventsForDifferentVenue = events.some(
                        event => event.track.name !== venueName
                    );

                    expect(hasEventsForDifferentVenue).to.be.false;

                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });

        it('should correctly match the track name irrespective of case', done => {
            const correctCaseVenueName = 'Silverstone';
            const incorrectCaseVenueName = 'siLverSTOne';

            const getNumberOfEventsForVenue = venue => {
                return lib
                    .getCarEventSummariesAtVenue(venue)
                    .then(events => events.length);
            };

            Promise.all([
                getNumberOfEventsForVenue(correctCaseVenueName),
                getNumberOfEventsForVenue(incorrectCaseVenueName)
            ])
                .then(results => {
                    const numberOfEventsWhenCorrectCase = results[0];
                    const numberOfEventsWhenIncorrectCase = results[1];

                    expect(numberOfEventsWhenCorrectCase).to.equal(
                        numberOfEventsWhenIncorrectCase
                    );

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

    describe('#getBikeEventSummariesAtVenue', () => {
        it('should only contain bike events for the given venue', done => {
            const venueName = 'Donington Park';

            lib
                .getBikeEventSummariesAtVenue(venueName)
                .then(events => {
                    const hasEventsForDifferentVenue = events.some(
                        event => event.track.name !== venueName
                    );

                    expect(hasEventsForDifferentVenue).to.be.false;

                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });

        it('should correctly match the track name irrespective of case', done => {
            const correctCaseVenueName = 'Brands Hatch';
            const incorrectCaseVenueName = 'BRANDS HATCH';

            const getNumberOfEventsForVenue = venue => {
                return lib
                    .getBikeEventSummariesAtVenue(venue)
                    .then(events => events.length);
            };

            Promise.all([
                getNumberOfEventsForVenue(correctCaseVenueName),
                getNumberOfEventsForVenue(incorrectCaseVenueName)
            ])
                .then(results => {
                    const numberOfEventsWhenCorrectCase = results[0];
                    const numberOfEventsWhenIncorrectCase = results[1];

                    expect(numberOfEventsWhenCorrectCase).to.equal(
                        numberOfEventsWhenIncorrectCase
                    );

                    done();
                })
                .catch(error => {
                    error = error || 'Failed to retrieve events';
                    done(error);
                });
        });
    });
});
