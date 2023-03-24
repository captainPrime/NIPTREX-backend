import { IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  public user_id!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9-_.@]+$/)
  @MinLength(3)
  @MaxLength(32)
  public personal_details_first_name!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9-_.@]+$/)
  @MinLength(3)
  @MaxLength(32)
  public personal_details_last_name!: string;

  @IsString()
  public personal_details_country!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  public personal_details_profile_picture!: string;

  @IsString()
  public personal_details_dob!: string;

  @IsString()
  public personal_details_role!: string;

  @IsString()
  public personal_details_phone_number!: string;

  @IsString()
  public personal_details_seniority!: string;

  @IsString()
  public personal_details_gender!: string;

  @IsString()
  public address_line1!: string;

  @IsString()
  public address_line2?: string;

  @IsString()
  public address_city!: string;

  @IsString()
  public address_state!: string;

  @IsString()
  public social_links_personal_website?: string;

  @IsString()
  public social_links_linkedin?: string;

  @IsString()
  public social_links_stack_overflow?: string;

  @IsString()
  public social_links_github?: string;

  @IsString()
  public social_links_dribble?: string;

  @IsString()
  public social_links_behance?: string;

  @IsString()
  public social_links_glass_door?: string;

  @IsString({ each: true })
  public languages!: string[];

  @IsString()
  public experience_start_date!: string;

  @IsString()
  public experience_end_date!: string;

  @IsString()
  public experience_company!: string;

  @IsString()
  public experience_country!: string;

  @IsString()
  public experience_role!: string;

  @IsString()
  public experience_employment_type!: string;

  @IsString()
  public experience_description?: string;

  @IsString()
  public education_history_institution?: string;

  @IsString()
  public education_history_field_of_study?: string;

  @IsString()
  public education_history_degree_level?: string;

  @IsString()
  public education_history_date_attended?: string;

  @IsString()
  public education_history_employment_type?: string;

  @IsString()
  public work_preference_industry_type!: string;

  @IsString()
  public work_preference_company_culture!: string;

  @IsString()
  public work_preference_company_size!: string;

  @IsString()
  public work_preference_project_duration!: string;

  @IsString()
  public work_preference_team_size!: string;

  @IsString()
  public work_preference_work_location!: string;

  @IsString()
  public work_preference_work_timezone!: string;

  @IsString()
  public work_preference_work_preference!: string;

  @IsString()
  public identity_proof_of_identity!: string;

  @IsString()
  public identity_proof_of_address!: string;

  @IsString()
  public certification_name!: string;

  @IsString()
  public certification_organisation!: string;

  @IsString()
  public certification_certificate_url!: string;

  @IsString()
  public certification_date_obtained!: string;

  @IsString()
  public billing!: string;

  @IsString()
  public billing_per_annum!: string;

  @IsString()
  public billing_hourly_rate!: string;

  @IsString()
  public billing_payment_method!: string;
}
