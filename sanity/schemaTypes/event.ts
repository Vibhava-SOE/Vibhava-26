import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'SDPK Hall, Seminar Hall, Placement Cell, etc.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'Format: HH:MM - HH:MM',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'object',
      fields: [
        defineField({
          name: 'day',
          type: 'string',
          title: 'Day',
          options: {
            list: [
              { title: '12th', value: '12' },
              { title: '13th', value: '13' },
            ],
          },
          initialValue: '12',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'month',
          type: 'string',
          title: 'Month',
          description: 'Automatically set to February. No need to edit.',
          initialValue: 'February',
          readOnly: true,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'year',
          type: 'string',
          title: 'Year',
          description: 'Automatically set to 2026. No need to edit.',
          initialValue: '2026',
          readOnly: true,
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Not Started', value: 'NotStarted' },
          { title: 'Open', value: 'Open' },
          { title: 'Closed', value: 'Closed' },
        ],
      },
      description: 'Determines booking availability. "NotStarted" and "Closed" will disable the booking button.',
      initialValue: 'NotStarted',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'club',
      title: 'Club',
      type: 'string',
      description: 'Enter Acronym of the club organizing the event (Eg: IEEE, SEDS, SAE, etc)',
      initialValue: 'None',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Brief summary of the event',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Image needs to be in 1080x1350px ratio. Use the poster you are circulating in whatsapp groups.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdBy",
      title: "Created By",
      type: "string",
      readOnly: true,
      initialValue: async (params, context) => {
        const { currentUser } = context;
        return currentUser?.email || 'Unknown';
      },
      hidden: ({ currentUser }) => !currentUser?.roles.some((role) => role.name === 'administrator'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'club',
      media: 'image',
    },
  },
})
