# Generated by Django 4.2.5 on 2023-09-28 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("lab", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="department",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
