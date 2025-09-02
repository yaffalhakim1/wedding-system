'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const weddingId = uuidv4();
    const now = new Date();

    // Insert wedding data
    await queryInterface.bulkInsert('weddings', [
      {
        id: weddingId,
        bride_name: 'Sarah Johnson',
        groom_name: 'Michael Davis',
        wedding_date: '2024-12-15',
        wedding_time: '15:00:00',
        venue_name: 'Grand Garden Hotel',
        venue_address: '123 Garden Street, Flower City, FC 12345',
        ceremony_time: '15:00:00',
        ceremony_location: 'Rose Garden Pavilion',
        reception_time: '17:00:00',
        reception_location: 'Grand Ballroom',
        created_at: now,
        updated_at: now
      }
    ]);

    // Insert sample RSVP data
    await queryInterface.bulkInsert('rsvps', [
      {
        id: uuidv4(),
        wedding_id: weddingId,
        guest_name: 'John Smith',
        guest_email: 'john.smith@email.com',
        guest_phone: '+1-555-0123',
        attendance_status: 'attending',
        number_of_guests: 2,
        dietary_restrictions: 'No allergies',
        special_requests: 'Vegetarian meal for guest',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        wedding_id: weddingId,
        guest_name: 'Emily Wilson',
        guest_email: 'emily.wilson@email.com',
        guest_phone: '+1-555-0456',
        attendance_status: 'attending',
        number_of_guests: 1,
        dietary_restrictions: 'Gluten-free',
        special_requests: null,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        wedding_id: weddingId,
        guest_name: 'Robert Brown',
        guest_email: 'robert.brown@email.com',
        guest_phone: null,
        attendance_status: 'not_attending',
        number_of_guests: 0,
        dietary_restrictions: null,
        special_requests: 'Sorry, will be traveling',
        created_at: now,
        updated_at: now
      }
    ]);

    // Insert sample messages
    await queryInterface.bulkInsert('messages', [
      {
        id: uuidv4(),
        wedding_id: weddingId,
        sender_name: 'Jane Doe',
        sender_email: 'jane.doe@email.com',
        message_text: 'Congratulations on your special day! Wishing you both a lifetime of love and happiness.',
        is_approved: true,
        approved_at: now,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        wedding_id: weddingId,
        sender_name: 'Mark Johnson',
        sender_email: 'mark.johnson@email.com',
        message_text: 'So excited to celebrate with you both! Can\'t wait for the big day!',
        is_approved: true,
        approved_at: now,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        wedding_id: weddingId,
        sender_name: 'Lisa Garcia',
        sender_email: 'lisa.garcia@email.com',
        message_text: 'Best wishes for your wedding and your future together!',
        is_approved: false,
        approved_at: null,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('photos', null, {});
    await queryInterface.bulkDelete('messages', null, {});
    await queryInterface.bulkDelete('rsvps', null, {});
    await queryInterface.bulkDelete('weddings', null, {});
  }
};